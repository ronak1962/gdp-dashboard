"""
Patel Analysis — ML Algo Trading Engine
Uses multiple models to predict stock direction and generate trading signals.

Models used:
1. Random Forest Classifier — best for non-linear patterns in stock data
2. KNN (K-Nearest Neighbors) — finds similar historical patterns
3. Logistic Regression — fast baseline trend prediction
4. Gradient Boosting — ensemble method for higher accuracy
5. Ensemble (voting) — combines all models for best signal

Features engineered from price data:
- Returns (1d, 3d, 5d, 10d)
- Moving average crossovers (SMA 5/10/20)
- RSI (14-period)
- Volatility (10-day rolling std)
- Volume momentum
- Price position in range
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler


def _compute_rsi(prices, period=14):
    """Calculate RSI from price series."""
    deltas = np.diff(prices)
    gains = np.where(deltas > 0, deltas, 0)
    losses = np.where(deltas < 0, -deltas, 0)

    avg_gain = np.convolve(gains, np.ones(period)/period, mode='valid')
    avg_loss = np.convolve(losses, np.ones(period)/period, mode='valid')

    rs = avg_gain / (avg_loss + 1e-10)
    rsi = 100 - (100 / (1 + rs))
    return rsi


def _engineer_features(prices):
    """Create ML features from price history."""
    prices = np.array(prices, dtype=float)
    n = len(prices)
    if n < 30:
        return None, None

    features = []
    labels = []

    for i in range(25, n - 5):
        window = prices[max(0, i-20):i+1]

        ret_1d = (prices[i] - prices[i-1]) / prices[i-1] * 100
        ret_3d = (prices[i] - prices[i-3]) / prices[i-3] * 100
        ret_5d = (prices[i] - prices[i-5]) / prices[i-5] * 100
        ret_10d = (prices[i] - prices[i-10]) / prices[i-10] * 100

        sma_5 = np.mean(prices[i-4:i+1])
        sma_10 = np.mean(prices[i-9:i+1])
        sma_20 = np.mean(prices[i-19:i+1])

        sma_cross_5_10 = (sma_5 - sma_10) / sma_10 * 100
        sma_cross_5_20 = (sma_5 - sma_20) / sma_20 * 100

        volatility = np.std(prices[i-9:i+1]) / prices[i] * 100

        price_position = (prices[i] - np.min(window)) / (np.max(window) - np.min(window) + 1e-10)

        momentum = (prices[i] - prices[i-5]) / (prices[i-5] - prices[i-10] + 1e-10)

        features.append([
            ret_1d, ret_3d, ret_5d, ret_10d,
            sma_cross_5_10, sma_cross_5_20,
            volatility, price_position, momentum,
        ])

        future_ret = (prices[min(i+5, n-1)] - prices[i]) / prices[i] * 100
        labels.append(1 if future_ret > 0.5 else (0 if future_ret > -0.5 else -1))

    return np.array(features), np.array(labels)


def _train_models(X, y):
    """Train all ML models."""
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    models = {
        "random_forest": RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42),
        "knn": KNeighborsClassifier(n_neighbors=7, weights='distance'),
        "logistic_regression": LogisticRegression(max_iter=1000, random_state=42),
        "gradient_boosting": GradientBoostingClassifier(n_estimators=80, max_depth=3, random_state=42),
    }

    trained = {}
    for name, model in models.items():
        model.fit(X_scaled, y)
        trained[name] = model

    return trained, scaler


def _get_prediction(models, scaler, features):
    """Get predictions from all models + ensemble vote."""
    X = scaler.transform([features])

    predictions = {}
    for name, model in models.items():
        pred = model.predict(X)[0]
        proba = model.predict_proba(X)[0] if hasattr(model, 'predict_proba') else None

        if pred == 1:
            signal = "BUY"
        elif pred == -1:
            signal = "SELL"
        else:
            signal = "HOLD"

        confidence = 0
        if proba is not None:
            confidence = int(np.max(proba) * 100)

        predictions[name] = {"signal": signal, "confidence": confidence}

    signals = [p["signal"] for p in predictions.values()]
    buy_count = signals.count("BUY")
    sell_count = signals.count("SELL")
    hold_count = signals.count("HOLD")

    if buy_count > sell_count and buy_count > hold_count:
        ensemble_signal = "BUY"
    elif sell_count > buy_count and sell_count > hold_count:
        ensemble_signal = "SELL"
    else:
        ensemble_signal = "HOLD"

    ensemble_confidence = int(max(buy_count, sell_count, hold_count) / len(signals) * 100)

    predictions["ensemble"] = {"signal": ensemble_signal, "confidence": ensemble_confidence}

    return predictions


def generate_algo_signals(prices: list[float], current_price: float) -> dict:
    """
    Main function: takes price history and returns ML trading signals.

    Args:
        prices: list of historical closing prices (at least 30 days)
        current_price: current live price

    Returns:
        dict with model predictions, ensemble signal, and feature values
    """
    if len(prices) < 30:
        return {"error": "Need at least 30 days of price history"}

    X, y = _engineer_features(prices)
    if X is None or len(X) < 10:
        return {"error": "Insufficient data for feature engineering"}

    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]

    if len(np.unique(y_train)) < 2:
        return {"error": "Not enough price variation for training"}

    models, scaler = _train_models(X_train, y_train)

    accuracies = {}
    if len(X_test) > 0:
        X_test_scaled = scaler.transform(X_test)
        for name, model in models.items():
            acc = model.score(X_test_scaled, y_test)
            accuracies[name] = int(acc * 100)

    latest_features = X[-1]
    predictions = _get_prediction(models, scaler, latest_features)

    ret_1d = (current_price - prices[-2]) / prices[-2] * 100 if len(prices) >= 2 else 0
    ret_5d = (current_price - prices[-6]) / prices[-6] * 100 if len(prices) >= 6 else 0
    sma_5 = np.mean(prices[-5:])
    sma_20 = np.mean(prices[-20:]) if len(prices) >= 20 else sma_5
    rsi_values = _compute_rsi(prices[-20:]) if len(prices) >= 20 else [50]
    rsi = rsi_values[-1] if len(rsi_values) > 0 else 50
    volatility = np.std(prices[-10:]) / current_price * 100

    return {
        "predictions": predictions,
        "accuracies": accuracies,
        "features": {
            "return_1d": round(ret_1d, 2),
            "return_5d": round(ret_5d, 2),
            "sma_5": round(sma_5, 2),
            "sma_20": round(sma_20, 2),
            "rsi": round(float(rsi), 2),
            "volatility": round(volatility, 2),
            "price_vs_sma20": round((current_price - sma_20) / sma_20 * 100, 2),
        },
        "ensemble": predictions["ensemble"],
    }
