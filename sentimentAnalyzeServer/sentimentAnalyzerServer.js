const express = require('express');
const dotenv = require('dotenv');
const app = new express();
dotenv.config();
app.use(express.static('client'))

const cors_app = require('cors');
function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 =  require('ibm-watson/natural-language-understanding/v1.js');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
     version: '2020-08-01',
     authenticator: new IamAuthenticator({
      apikey: api_key,
     }),
     serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}
const nlu = getNLUInstance();
async function analyzeSentiemntText(data) {

    let promise = new Promise((resolve, reject) => {
        var parameters = { text: data,features : {sentiment: {}}}
        ret = nlu.analyze( parameters ) 
               .then (analysisResults => {
               resolve(JSON.stringify(analysisResults['result']['sentiment']['document']['label']))
            })
               .catch(err=> {console.log( "error",err);
               });
    });
  
    let result = await promise;
  return result;
  }
  async function analyseEmotionText(data) {

    let promise = new Promise((resolve, reject) => {
        console.log( "request /text/emotion"+ data);
        var parameters = { text: data,features : {emotion: {}}}
        ret = nlu.analyze( parameters ) //, function( error, response){
               .then (analysisResults => {
                resolve(JSON.stringify(analysisResults['result']['emotion']['document']['emotion']));
               })
               .catch(err=> {console.log( "error",err);
               });
    
    });
  
    let result = await promise;
    return result;
  }
  async function analyseEmotiontUrl(data) {

    let promise = new Promise((resolve, reject) => {
        console.log( "request /text/emotion"+ data);
        var parameters = { url: data,features : {emotion: {}}}
        ret = nlu.analyze( parameters ) //, function( error, response){
               .then (analysisResults => {
                resolve(JSON.stringify(analysisResults['result']['emotion']['document']['emotion']));
               })
               .catch(err=> {console.log( "error",err);
               });
    
    });
  
    let result = await promise;
    return result;
  }
  async function analyzeSentiemntUrl(data) {

    let promise = new Promise((resolve, reject) => {
        var parameters = { url: data,features : {sentiment: {}}}
        ret = nlu.analyze( parameters ) 
               .then (analysisResults => {
               resolve(JSON.stringify(analysisResults['result']['sentiment']['document']['label']))
            })
               .catch(err=> {console.log( "error",err);
               });
    });
  
    let result = await promise;
  return result;
  }
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", async function(req,res)  {

    return await res.send(await analyseEmotiontUrl(req.query.url));
});

app.get("/url/sentiment", async function(req,res)  {
    return await res.send(await analyzeSentiemntUrl(req.query.url));
});
 
app.get("/text/emotion", async function(req,res)  {

        return await res.send( await analyseEmotionText(req.query.text));
});

app.get("/text/sentiment",async function(req,res)  {
   
        return await res.send(await analyzeSentiemntText(req.query.text));
   
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

