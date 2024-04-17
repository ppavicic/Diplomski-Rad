const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db')
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-ayfGnl2VUYoLFy88Eb2QaJZ6',
});

router.post('/', async function (req, res) {
  try {
    const cookie = req.cookies['jwt']
    const claims = jwt.verify(cookie, process.env.JWT_SECRET_KEY);

    if (!claims) {
      return res.status(401).send({
        message: 'Unauthenticated - Cookie invalid'
      })
    }

    let prompt = "";
    if (req.body.type === 'nadopuna') {
      prompt = `Pravim zadatak za provjeru pravopisa iz hrvatskog jezika. Zadatak je tipa nadopunjavanja pa bi mi trebao izgenerirat rečenicu u kojoj će korisnici morat unijet ispravnu riječ. 
      Hoću da mi vratiš odgovor u obliku JSON. Tako da mi generirana rečenica bude navedena pod atributom "question". Riječ koju će trebati nadopunit pod atributom "fillin".
      Pomoć pod atributom "hint". Koristi hrvatski jezik i pravopis. Ne koristi navodnike u hintu.${req.body.prompt}`;
    } else if (req.body.type === 'diktat') {
      prompt = `${req.body.prompt} Hoću da mi vratiš odgovor u obliku JSON. Tako da mi tekst za diktat bude naveden pod atributom "text". 
      Koristi hrvatski jezik i pravopis.`
    } else if (req.body.type === 'odabir') {
      prompt = `Generiraj mi rečenicu koja sadrži ispravnu riječ: ${req.body.prompt}. Također od te riječi napravi pravopisno krivu riječ, npr. zamijeni ć sa č, ije sa je (umjesto cvijet cvjet) i slično, itd. 
      Hoću da mi vratiš odgovor u obliku JSON. Tako da mi generirana rečenica bude navedena pod atributom "pitanje". Ispravno navedena riječ pod atributom "odgovor1". Krivo navedena riječ pod atributom "odgovor2".
      Pomoć pod atributom "hint". Koristi hrvatski jezik i pravopis. Ne koristi navodnike u hintu.`
    } else if (req.body.type === 'tablica') {
      prompt = `Generiraj mi niz riječi sa slovima: ${req.body.prompt}. Za svako slovo generiraj po 5 riječi. Od tih riječi napravi tablicu tako da su u jednom stupcu riječi sa jednim slovom
      a u drugom riječi sa drugim slovom. Hoću da mi vratiš odgovor u obliku JSON. Tako da mi riječi iz prvog stupca budu pod atributom "stupac1". Riječi iz drugog stupca pod atributom "stupac2".
      Pomoć pod atributom "hint". Koristi hrvatski jezik i pravopis. Ne koristi navodnike u hintu.`
    }

    const response = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: prompt
      }],
      model: "gpt-3.5-turbo",
    });

    console.log(response.choices[0]);

    return res.status(200).json({
      success: true,
      result: response.choices[0].message.content,
    });
  } catch (err) {
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: "You have exceeded your current quota."
      });
    } else {
      return res.status(400).json({
        success: false,
        error: error.response ? error.response.data : "There was an issue on the server",
      });
    }
  }
})

module.exports = router;