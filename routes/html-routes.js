const router = require("express").Router();
const request = require("request");
const state = process.env.STATE || "CiscoCMS";
let states = {};

//helper function
function accTokenReq(callback,grantType) {
    const getTokenOptions = {
        method: "POST",
        url: "https://api.ciscospark.com/v1/access_token",
        headers: {
            "content-type": "application/x-www-form-urlencoded"
        },
        form: {
            grant_type: grantType,
            client_id: states.clientId,
            client_secret: states.clientSecret,
            code: states.accessCode,
            redirect_uri: states.redirectURI
        }
    };

    const refreshTokenOptions = {
        method: "POST",
        url: "https://api.ciscospark.com/v1/access_token",
        headers: {
           "content-type": "application/x-www-form-urlencoded"
        },
        form: {
           grant_type: grantType,
           client_id: states.clientId,
           client_secret: states.clientSecret,
           refresh_token: states.refreshToken
        }
     };
    const options = (grantType === "refresh_token") ? refreshTokenOptions : getTokenOptions;
    request(options, (error, res, body) => {
        //check payload
        console.log(body);
        const parsedBody = JSON.parse(body);
        states = {
            ...states,
            accessToken: parsedBody.access_token,
            accessTokenExpiresIn: parsedBody.expires_in,
            refreshToken: parsedBody.refresh_token,
            refreshTokenExpiresIn: parsedBody.refresh_token_expires_in
        }
        console.log(states);
        callback();
    })
}

//initial input form for client ID and secret
router.get('/', (req, res) => {
    // const resHTML = ejs.render()
    res.render('index.ejs', { isStarted: false });
    // ejs.render('index.ejs') 
});

router.post("/api/start", (req, res) => {
    const { id, redirectURI, scope, secret } = req.body;
    states = {
        clientId: id,
        clientSecret: secret,
        redirectURI: redirectURI,
        scope: scope
    }
    const initiateURL = "https://api.ciscospark.com/v1/authorize?"
        + "client_id=" + id
        + "&response_type=code"
        + "&redirect_uri=" + encodeURIComponent(redirectURI)
        + "&scope=" + encodeURIComponent(scope)
        + "&state=" + state;

    console.log(initiateURL);
    res.json({
        initiateURL: initiateURL
    })
})

router.get('/oauth', (req, res) => {
    states["accessCode"] = req.query.code;
    const callbackRender = ()=>{
        res.render('index.ejs', {
            isStarted: true,
            accessCode: states.accessCode,
            accessToken: states.accessToken,
            accessTokenExpiresIn: states.accessTokenExpiresIn,
            refreshToken: states.refreshToken,
            refreshTokenExpiresIn: states.refreshTokenExpiresIn
        })
    }
    accTokenReq(callbackRender,"authorization_code");
})

router.get('/refreshtokens', (req, res) => {
    const callbackRender = ()=>{
        res.render('index.ejs', {
            isStarted: true,
            accessCode: states.accessCode,
            accessToken: states.accessToken,
            accessTokenExpiresIn: states.accessTokenExpiresIn,
            refreshToken: states.refreshToken,
            refreshTokenExpiresIn: states.refreshTokenExpiresIn
        })
    }
    accTokenReq(callbackRender,"refresh_token");
})



module.exports = router;