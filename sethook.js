const token = process.env.BOT_TOKEN;
const domain = process.env.DOMAIN;

fetch(`https://api.telegram.org/bot${token}/setWebhook?url=${domain}`, {
    method: 'post',
}).then(response => {
    console.log(response.statusText);
});
