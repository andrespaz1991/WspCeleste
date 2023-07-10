//npm i cheerio
//npm i http

const http = require('http');
const fs = require('fs');
const qrcode = require('qrcode');
const axios = require('axios');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { exec } = require('child_process');
const opn = require('opn');
const cheerio = require('cheerio');
 

const client = new Client({
  authStrategy: new LocalAuth()
});
const qrFilePath = 'qr.html';
function saveQRCodeToHTML(qr) {
  qrcode.toDataURL(qr, { small: true }, (err, url) => {
    if (err) {
      console.error('Error al generar el código QR:', err);
      return;
    }
    const qrHtml = `<img src="${url}">`;
    fs.writeFile(qrFilePath, qrHtml, (err) => {
      if (err) {
        console.error('Error al guardar el código QR en el archivo:', err);
        return;
      }
      console.log('El código QR ha sido guardado en el archivo:', qrFilePath);
      const openCommand = process.platform === 'win32' ? 'start' : 'xdg-open';
      exec(`${openCommand} ${qrFilePath}`, (error) => {
        if (error) {
          console.error('Error al abrir el archivo en el navegador:', error);
          return;
        }
        console.log('Archivo abierto en el navegador');
      });
    });
  });
}

client.on('qr', qr => {
  saveQRCodeToHTML(qr);
});

client.on('ready', () => {
  console.log('Conexión exitosa!');
  
  
const filePath = 'qr.html';
// Contenido a sobrescribir
const nuevoContenido = '<h1>Conexión exitosa</h1>';
//Escribir el nuevo contenido en el archivo
fs.writeFile(filePath, nuevoContenido, (err) => {
  if (err) {
    console.error('Error al sobrescribir el archivo:', err);
    return;
  }
  console.log('El archivo ha sido sobrescrito exitosamente.');
});

});



/*
/////Mencionar al usuario
const chat = await message.getChat();
        const contact = await message.getContact();
        await chat.sendMessage(`Hello @${contact.id.user}`, {
            mentions: [contact]
        });
//////////////////////



client.on('authenticated', (session) => {    //saber cuando se autentico 
    // Save the session object however you prefer.
    // Convert it to json, save it to a file, store it in a database...
});

client.on('message', message => {
	console.log(message.body);
});
*/

client.on('message', async message => {
  if (message.body === 'Hola Celeste') {
    try {
        const response = await axios.get('http://localhost/mensaje/');
      //enviar como replica a un mensaje client.sendMessage(message.from, 'pong');
      const phpResponse = response.data;
      client.sendMessage(message.from, phpResponse);
     //const { MessageMedia } = require('whatsapp-web.js');
     //const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
     //client.sendMessage(message.from, media);
        
     /*
        const { MessageMedia } = require('whatsapp-web.js');
        const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
        client.sendMessage(media);
      
      */
    } catch (error) {
      console.error('Error al enviar la solicitud a PHP:', error);
    }
  }
});

client.initialize();
