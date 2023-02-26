import fetch from 'isomorphic-fetch';
import { RequestHandler } from 'express';

interface Params {}

interface ResponseBody {

}

interface RequestBody {
  username: string;
  password: string;
}

const handler: RequestHandler<Params, ResponseBody, RequestBody> = (req, res) => {
  fetch('https://hp-api-iim.azurewebsites.net/auth/log-in', {
    method : 'POST',
    headers: [['Content-Type', 'application/json']],
    body   : JSON.stringify({
      name    : req.body.username,
      password: req.body.password,
    }),
  }).then(async (r) => {
    if (r.ok) return r.json();
    else throw await r.json();
  }).then((r) => {
    res.json(r);
  }).catch((e) => {
    res.status(500)
      .json(e);
  });
};

export default handler;
