import requests

API_KEY = "a3580565"  # Substitua pela chave real da API

def get_climate_data(latitude, longitude):
    url_clima = f"https://api.hgbrasil.com/weather?key={API_KEY}&lat={latitude}&lon={longitude}&format=json"
    response = requests.get(url_clima)

    if response.status_code == 200:
        clima_data = response.json()

        if clima_data.get("results"):
            results = clima_data["results"]
            clima_atual = {
                "temperatura": results.get("temp"),
                "descricao": results.get("description"),
                "umidade": results.get("humidity"),
                "vento": results.get("wind_speedy"),
                "cidade": results.get("city"),
                "fase_da_lua": results.get("moon_phase"),
            }

            previsao_dias = [
                {
                    "dia": prev.get("date"),
                    "descricao": prev.get("description"),
                    "min": prev.get("min"),
                    "max": prev.get("max")
                }
                for prev in results.get("forecast", [])[:5]
            ]

            return {"clima_atual": clima_atual, "previsao_dias": previsao_dias}

    raise ValueError("Erro ao buscar dados climáticos.")
