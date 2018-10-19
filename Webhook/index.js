// Author: Dhruv Avdhesh
// Author Email: me[at]dhruvavdhesh[dot]in
// Author URL: www.dhruvavdhesh.in

const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const CurrencyExchangeAPI = 'https://v3.exchangerate-api.com/pair/2aced54c2a7e6bf49ee60e7f';
const NewsAPI = 'https://newsapi.org/v1/articles?source=the-times-of-India&apiKey=8a1ce8e70c57490989f4800993629d71';
const RestaurantsAPI = 'https://developers.zomato.com/api/v2.1/';
const RestaurantsApiKey = '8a48ff0160f1107e3ace70f0f80f7e1c';
const WeatherAPI = 'https://api.apixu.com/v1/current.json?key=dd0f3a95a1f34f2781c51604171010';
const WebSearchAPI = 'https://en.wikipedia.org/w/api.php?';

app.post('/webhook', function (req, res) {
	
	// Currency Exchange
	if (req.body.result.parameters['currencyfrom'] && req.body.result.parameters['currencyto']) {
		var cfrom = req.body.result.parameters['currencyfrom'];
        var cto = req.body.result.parameters['currencyto'];
		callCurrencyExchangeApi(cfrom,cto)
            .then((output) => {
                    let displayText = `From: ${output.from} \nTo: ${output.to} \nRate: ${output.rate}`; 
                    let telegramText = htmlEntities(`From: ${output.from} \nTo: ${output.to} \nRate: ${output.rate}`);
                    let result = toApiAiResponseMessage(displayText, displayText, toTelgramObject(telegramText, 'Markdown'));
                res.setHeader('Content-Type', 'application/json');
                if (result) {
                    res.send(JSON.stringify(result));
                }
                else {
                    res.send(JSON.stringify(displayText));
                }
			});
    }
	
	// News
	else if (req.body.result.parameters['news']) {
        callNewsApi()
            .then((output) => {
                    displayText = `*Headlines* \n\n${output.articles[0].title} \n\n${output.articles[1].title} \n\n${output.articles[2].title} \n\n${output.articles[3].title} \n\n${output.articles[4].title} \n\n${output.articles[5].title} \n\n${output.articles[6].title}`;
                    let telegramText = htmlEntities(`*Headlines* \n\n${output.articles[0].title} \n\n${output.articles[1].title} \n\n${output.articles[2].title} \n\n${output.articles[3].title} \n\n${output.articles[4].title} \n\n${output.articles[5].title} \n\n${output.articles[6].title}`);
                    let result = toApiAiResponseMessage(displayText, displayText, toTelgramObject(telegramText, 'Markdown'));
                res.setHeader('Content-Type', 'application/json');
                if (result) {
                    res.send(JSON.stringify(result));
                }
                else {
                    res.send(JSON.stringify(displayText));
                }
			});
    }
	
	// Restaurants
    else if (req.body.result.parameters['restaurants']) {
        var rloc = req.body.result.parameters['restaurants'];
		var cuisine = req.body.result.parameters['cuisine'];
        callRestaurantsApi1(rloc)
            .then((output) => { 
			var entityType = `${output.location_suggestions[0].entity_type}`;
			var entityId = `${output.location_suggestions[0].entity_id}`;
			return callRestaurantsApi2(entityType,entityId,cuisine);
			})
			.then((output) => {
                    let displayText = `*Top 10 Restaurants* \n\nName: ${output.restaurants[0].restaurant.name}, Address: ${output.restaurants[0].restaurant.location.address}, Cuisines: ${output.restaurants[0].restaurant.cuisines}, Cost for Two: ${output.restaurants[0].restaurant.average_cost_for_two}, Currency: ${output.restaurants[0].restaurant.currency}, User Rating: ${output.restaurants[0].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[1].restaurant.name}, Address: ${output.restaurants[1].restaurant.location.address}, Cuisines: ${output.restaurants[1].restaurant.cuisines}, Cost for Two: ${output.restaurants[1].restaurant.average_cost_for_two}, Currency: ${output.restaurants[1].restaurant.currency}, User Rating: ${output.restaurants[1].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[2].restaurant.name}, Address: ${output.restaurants[2].restaurant.location.address}, Cuisines: ${output.restaurants[2].restaurant.cuisines}, Cost for Two: ${output.restaurants[2].restaurant.average_cost_for_two}, Currency: ${output.restaurants[2].restaurant.currency}, User Rating: ${output.restaurants[2].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[3].restaurant.name}, Address: ${output.restaurants[3].restaurant.location.address}, Cuisines: ${output.restaurants[3].restaurant.cuisines}, Cost for Two: ${output.restaurants[3].restaurant.average_cost_for_two}, Currency: ${output.restaurants[3].restaurant.currency}, User Rating: ${output.restaurants[3].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[4].restaurant.name}, Address: ${output.restaurants[4].restaurant.location.address}, Cuisines: ${output.restaurants[4].restaurant.cuisines}, Cost for Two: ${output.restaurants[4].restaurant.average_cost_for_two}, Currency: ${output.restaurants[4].restaurant.currency}, User Rating: ${output.restaurants[4].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[5].restaurant.name}, Address: ${output.restaurants[5].restaurant.location.address}, Cuisines: ${output.restaurants[5].restaurant.cuisines}, Cost for Two: ${output.restaurants[5].restaurant.average_cost_for_two}, Currency: ${output.restaurants[5].restaurant.currency}, User Rating: ${output.restaurants[5].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[6].restaurant.name}, Address: ${output.restaurants[6].restaurant.location.address}, Cuisines: ${output.restaurants[6].restaurant.cuisines}, Cost for Two: ${output.restaurants[6].restaurant.average_cost_for_two}, Currency: ${output.restaurants[6].restaurant.currency}, User Rating: ${output.restaurants[6].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[7].restaurant.name}, Address: ${output.restaurants[7].restaurant.location.address}, Cuisines: ${output.restaurants[7].restaurant.cuisines}, Cost for Two: ${output.restaurants[7].restaurant.average_cost_for_two}, Currency: ${output.restaurants[7].restaurant.currency}, User Rating: ${output.restaurants[7].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[8].restaurant.name}, Address: ${output.restaurants[8].restaurant.location.address}, Cuisines: ${output.restaurants[8].restaurant.cuisines}, Cost for Two: ${output.restaurants[8].restaurant.average_cost_for_two}, Currency: ${output.restaurants[8].restaurant.currency}, User Rating: ${output.restaurants[8].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[9].restaurant.name}, Address: ${output.restaurants[9].restaurant.location.address}, Cuisines: ${output.restaurants[9].restaurant.cuisines}, Cost for Two: ${output.restaurants[9].restaurant.average_cost_for_two}, Currency: ${output.restaurants[9].restaurant.currency}, User Rating: ${output.restaurants[9].restaurant.user_rating.aggregate_rating}`;
                    let telegramText = htmlEntities(`*Top 10 Restaurants* \n\nName: ${output.restaurants[0].restaurant.name}, Address: ${output.restaurants[0].restaurant.location.address}, Cuisines: ${output.restaurants[0].restaurant.cuisines}, Cost for Two: ${output.restaurants[0].restaurant.average_cost_for_two}, Currency: ${output.restaurants[0].restaurant.currency}, User Rating: ${output.restaurants[0].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[1].restaurant.name}, Address: ${output.restaurants[1].restaurant.location.address}, Cuisines: ${output.restaurants[1].restaurant.cuisines}, Cost for Two: ${output.restaurants[1].restaurant.average_cost_for_two}, Currency: ${output.restaurants[1].restaurant.currency}, User Rating: ${output.restaurants[1].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[2].restaurant.name}, Address: ${output.restaurants[2].restaurant.location.address}, Cuisines: ${output.restaurants[2].restaurant.cuisines}, Cost for Two: ${output.restaurants[2].restaurant.average_cost_for_two}, Currency: ${output.restaurants[2].restaurant.currency}, User Rating: ${output.restaurants[2].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[3].restaurant.name}, Address: ${output.restaurants[3].restaurant.location.address}, Cuisines: ${output.restaurants[3].restaurant.cuisines}, Cost for Two: ${output.restaurants[3].restaurant.average_cost_for_two}, Currency: ${output.restaurants[3].restaurant.currency}, User Rating: ${output.restaurants[3].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[4].restaurant.name}, Address: ${output.restaurants[4].restaurant.location.address}, Cuisines: ${output.restaurants[4].restaurant.cuisines}, Cost for Two: ${output.restaurants[4].restaurant.average_cost_for_two}, Currency: ${output.restaurants[4].restaurant.currency}, User Rating: ${output.restaurants[4].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[5].restaurant.name}, Address: ${output.restaurants[5].restaurant.location.address}, Cuisines: ${output.restaurants[5].restaurant.cuisines}, Cost for Two: ${output.restaurants[5].restaurant.average_cost_for_two}, Currency: ${output.restaurants[5].restaurant.currency}, User Rating: ${output.restaurants[5].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[6].restaurant.name}, Address: ${output.restaurants[6].restaurant.location.address}, Cuisines: ${output.restaurants[6].restaurant.cuisines}, Cost for Two: ${output.restaurants[6].restaurant.average_cost_for_two}, Currency: ${output.restaurants[6].restaurant.currency}, User Rating: ${output.restaurants[6].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[7].restaurant.name}, Address: ${output.restaurants[7].restaurant.location.address}, Cuisines: ${output.restaurants[7].restaurant.cuisines}, Cost for Two: ${output.restaurants[7].restaurant.average_cost_for_two}, Currency: ${output.restaurants[7].restaurant.currency}, User Rating: ${output.restaurants[7].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[8].restaurant.name}, Address: ${output.restaurants[8].restaurant.location.address}, Cuisines: ${output.restaurants[8].restaurant.cuisines}, Cost for Two: ${output.restaurants[8].restaurant.average_cost_for_two}, Currency: ${output.restaurants[8].restaurant.currency}, User Rating: ${output.restaurants[8].restaurant.user_rating.aggregate_rating} \n\nName: ${output.restaurants[9].restaurant.name}, Address: ${output.restaurants[9].restaurant.location.address}, Cuisines: ${output.restaurants[9].restaurant.cuisines}, Cost for Two: ${output.restaurants[9].restaurant.average_cost_for_two}, Currency: ${output.restaurants[9].restaurant.currency}, User Rating: ${output.restaurants[9].restaurant.user_rating.aggregate_rating}`);
					let result = toApiAiResponseMessage(displayText, displayText, toTelgramObject(telegramText, 'Markdown'));
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }); 
    }
	
	// Weather
    else if (req.body.result.parameters['weather']) {
        var city = req.body.result.parameters['weather'];
        callWeatherApi(city)
            .then((output) => {
                    let displayText = `Temperature (in °C): ${output.current.temp_c} \nTemperature (in °F): ${output.current.temp_f} \nWind Speed: ${output.current.wind_mph} miles/hour, \nHumidity: ${output.current.humidity}% \nVisibility: ${output.current.vis_km} km`;
                    let telegramText = htmlEntities(`Temperature (in °C): ${output.current.temp_c} \nTemperature (in °F): ${output.current.temp_f} \nWind Speed: ${output.current.wind_mph} miles/hour, \nHumidity: ${output.current.humidity}% \nVisibility: ${output.current.vis_km} km`);
					let result = toApiAiResponseMessage(displayText, displayText, toTelgramObject(telegramText, 'Markdown'));
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            });
    }
	
	// Web Search
    else if (req.body.result.parameters['websearch']) {
        var searchTerm = req.body.result.parameters['websearch'];
        callWebSearchApi(searchTerm)
            .then((output) => {
                let displayText = `Nothing Found for: ${searchTerm}`;
                let result;
                if (output && output[0]) {
                    displayText = `${output[2][0]}`;
                    let telegramText = htmlEntities(`${output[2][0]}`);
                    result = toApiAiResponseMessage(displayText, displayText, toTelgramObject(telegramText, 'Markdown'));
                }
                res.setHeader('Content-Type', 'application/json');
                if (result) {
                    res.send(JSON.stringify(result));
                }
                else {
                    res.send(JSON.stringify(displayText));
                }
            });
    }
	
	
	// Fallback
    else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': "Whoa dude! You got me totally mindfucked...", 'displayText': "Whoa dude! You got me totally mindfucked..." }));
    }
});

// Functions

function callCurrencyExchangeApi(cfrom,cto) {
    return new Promise((resolve, reject) => {
		let url = `${CurrencyExchangeAPI}/${cfrom}/${cto}`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callNewsApi() {
    return new Promise((resolve, reject) => {
        https.get(NewsAPI, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callRestaurantsApi1(rloc) {
    return new Promise((resolve, reject) => {
		let url = `${RestaurantsAPI}/locations?apikey=${RestaurantsApiKey}&query=${rloc}`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callRestaurantsApi2(entityType,entityId,cuisine) {
    return new Promise((resolve, reject) => {
		let url = `${RestaurantsAPI}/search?apikey=${RestaurantsApiKey}&entity_id=${entityId}&entity_type=${entityType}&q=${cuisine}&count=10&sort=rating&order=desc`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callWeatherApi(city) {
    return new Promise((resolve, reject) => {
        let url = `${WeatherAPI}&q=${city}`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function callWebSearchApi(searchTerm, format = "json", action = "opensearch", limit = 2, profile = "fuzzy") {
    return new Promise((resolve, reject) => {
        let url = `${WebSearchAPI}&format=${format}&action=${action}&limit=${limit}&profile=${profile}&search=${searchTerm}`;
        https.get(url, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                let jO = JSON.parse(body);
                resolve(jO);
            });
            res.on('error', (error) => {
                reject(error);
            });
        });
    });
}

function toTelgramObject(text, parse_mode) {
    return {
        text: text,
        parse_mode: parse_mode
    }
}

function toApiAiResponseMessage(speech, displayText, telegramObject = null) {
    return {
        speech: speech,
        displayText: displayText,
        data: {
            telegram: telegramObject
        }
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function errorHandler(error) {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(toApiAiResponseMessage(error, error, toTelgramObject(error, 'Markdown'))));
}

app.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});