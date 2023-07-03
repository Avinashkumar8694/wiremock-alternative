const handlebars = require('handlebars');

const template = handlebars.compile(`
Handlebars <b>{{query.name}} {{body.abc}}</b>
`);

const queryParams = {role: 'admin'};
const body = '{"users": [{"name": "John Doe", "role": "admin"}, {"name": "Jane Doe", "role": "user"}, {"name": "Bob Smith", "role": "admin"}]}';

const users = JSON.parse(body).users;

const json = template({ query: {name : "rocks!"}, body: {abc:"sdsds"} });

console.log(json);

