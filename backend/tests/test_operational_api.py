from fastapi.testclient import TestClient

from app.main import app


def test_operational_endpoints() -> None:
    with TestClient(app) as client:
        assert client.get("/api/health").json() == {
            "status": "operational",
            "service": "signalwatch-backend",
        }

        telemetry = client.get("/api/telemetry").json()
        assert telemetry["heartbeat"]
        assert "collector_reliability" in telemetry

        collectors = client.get("/api/collectors").json()
        assert isinstance(collectors, list)

        signals = client.get("/api/signals").json()
        assert isinstance(signals, list)


def test_operational_websocket_stream() -> None:
    with TestClient(app) as client:
        with client.websocket_connect("/ws/events") as websocket:
            snapshot = websocket.receive_json()
            event = websocket.receive_json()

        assert snapshot["type"] == "snapshot"
        assert event["type"] in {
            "signal.event",
            "telemetry.update",
            "collector.health",
            "source.latency",
            "semantic.cluster",
            "watcher.reconnect",
            "trend.spike",
            "alignment.alert",
            "system.heartbeat",
        }
