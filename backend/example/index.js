var express = require('express');
var router = express.Router();
var fs = require('fs');
var worldListArr = new Array();
var games = require("./games");
var users = require("./users");
var Game = require('./gameModel');
var metadatas = require("./metadatas")
var wordlists = require("./wordlists");
var passwordHash = require('password-hash');

function chooseWord(level) {
    var index = Math.floor(Math.random() * worldListArr.length);
    for (; ;) {
        if (worldListArr[index].length >= level.minLength && worldListArr[index].length <= level.maxLength) {
            break;
        } else {
            index = Math.floor(Math.random() * worldListArr.length);
        }
    }
    return worldListArr[index];
}

var metaData = {
    "name": "metadata",
    "levels": {
        "easy": {"name": "easy", "minLength": 3, "maxLength": 5, "guesses": 8},
        "medium": {"name": "medium", "minLength": 4, "maxLength": 10, "guesses": 7},
        "hard": {"name": "hard", "minLength": 9, "maxLength": 300, "guesses": 6}
    },
    "fonts": [{
        "url": "https://fonts.googleapis.com/css?family=Acme",
        "rule": "'Acme', Sans Serif",
        "family": "Acme",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Alef",
        "rule": "'Alef', Sans Serif",
        "family": "Alef",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Almendra",
        "rule": "'Almendra', Serif",
        "family": "Almendra",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Amiko",
        "rule": "'Amiko', Sans Serif",
        "family": "Amiko",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Armata",
        "rule": "'Armata', Sans Serif",
        "family": "Armata",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Artifika",
        "rule": "'Artifika', Serif",
        "family": "Artifika",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Bentham",
        "rule": "'Bentham', Serif",
        "family": "Bentham",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Cabin%20Sketch",
        "rule": "'Cabin Sketch', Display",
        "family": "Cabin Sketch",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Capriola",
        "rule": "'Capriola', Sans Serif",
        "family": "Capriola",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Content",
        "rule": "'Content', Display",
        "family": "Content",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Contrail%20One",
        "rule": "'Contrail One', Display",
        "family": "Contrail One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Convergence",
        "rule": "'Convergence', Sans Serif",
        "family": "Convergence",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Delius%20Unicase",
        "rule": "'Delius Unicase', Handwriting",
        "family": "Delius Unicase",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Didact%20Gothic",
        "rule": "'Didact Gothic', Sans Serif",
        "family": "Didact Gothic",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Dorsa",
        "rule": "'Dorsa', Sans Serif",
        "family": "Dorsa",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Dynalight",
        "rule": "'Dynalight', Display",
        "family": "Dynalight",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=El%20Messiri",
        "rule": "'El Messiri', Sans Serif",
        "family": "El Messiri",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Flamenco",
        "rule": "'Flamenco', Display",
        "family": "Flamenco",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Fugaz%20One",
        "rule": "'Fugaz One', Display",
        "family": "Fugaz One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Galada",
        "rule": "'Galada', Display",
        "family": "Galada",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Geostar%20Fill",
        "rule": "'Geostar Fill', Display",
        "family": "Geostar Fill",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Gravitas%20One",
        "rule": "'Gravitas One', Display",
        "family": "Gravitas One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Gudea",
        "rule": "'Gudea', Sans Serif",
        "family": "Gudea",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=IM%20Fell%20English",
        "rule": "'IM Fell English', Serif",
        "family": "IM Fell English",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Kranky",
        "rule": "'Kranky', Display",
        "family": "Kranky",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Kreon",
        "rule": "'Kreon', Serif",
        "family": "Kreon",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Lobster",
        "rule": "'Lobster', Display",
        "family": "Lobster",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Lora",
        "rule": "'Lora', Serif",
        "family": "Lora",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Medula%20One",
        "rule": "'Medula One', Display",
        "family": "Medula One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Miss%20Fajardose",
        "rule": "'Miss Fajardose', Handwriting",
        "family": "Miss Fajardose",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Molle",
        "rule": "'Molle', Handwriting",
        "family": "Molle",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Moulpali",
        "rule": "'Moulpali', Display",
        "family": "Moulpali",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Open%20Sans%20Condensed",
        "rule": "'Open Sans Condensed', Sans Serif",
        "family": "Open Sans Condensed",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Over%20the%20Rainbow",
        "rule": "'Over the Rainbow', Handwriting",
        "family": "Over the Rainbow",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Padauk",
        "rule": "'Padauk', Sans Serif",
        "family": "Padauk",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Podkova",
        "rule": "'Podkova', Serif",
        "family": "Podkova",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Risque",
        "rule": "'Risque', Display",
        "family": "Risque",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Sahitya",
        "rule": "'Sahitya', Serif",
        "family": "Sahitya",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Sarala",
        "rule": "'Sarala', Sans Serif",
        "family": "Sarala",
        "category": "Sans Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Shadows%20Into%20Light",
        "rule": "'Shadows Into Light', Handwriting",
        "family": "Shadows Into Light",
        "category": "Handwriting"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Source%20Serif%20Pro",
        "rule": "'Source Serif Pro', Serif",
        "family": "Source Serif Pro",
        "category": "Serif"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Squada%20One",
        "rule": "'Squada One', Display",
        "family": "Squada One",
        "category": "Display"
    }, {
        "url": "https://fonts.googleapis.com/css?family=Yesteryear",
        "rule": "'Yesteryear', Handwriting",
        "family": "Yesteryear",
        "category": "Handwriting"
    }],
    "ttl": 180000,
    "defaults": {
        "colors": {"guessBackground": "#ffffff", "wordBackground": "#aaaaaa", "textBackground": "#000000"},
        "level": {"name": "medium", "minLength": 4, "maxLength": 10, "guesses": 7},
        "font": {
            "url": "https://fonts.googleapis.com/css?family=Acme",
            "rule": "'Acme', Sans Serif",
            "family": "Acme",
            "category": "Sans Serif"
        }
    }
};


var wordArr = new Array;
fs.readFile(__dirname + "/../routes/wordlist.txt", {encoding: 'utf8'}, function (err, data) {
    if (err) {
        return;
    }
    wordArr = data.split("\r\n")
});


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function readWord() {
    wordlists.getwordArr(function (err, result) {
        if (err) {
        } else {
            if (result[0]) {
                worldListArr = result[0].words;
            }
        }
    })
}
module.exports.readWord = readWord();


router.get('/wordgame/metadata', function (req, res, next) {//init metadata
    metadatas.saveMetadata(metaData.levels, metaData.fonts, metaData.defaults, function (err, results) {
        res.send(results)
    })
});


router.get('/wordgame/init', function (req, res, next) {//init user
    var newUser = {
        name: {first: 'Bilbo', last: 'Baggins'},
        email: 'a@b.com',
        role: 'admin',
        status: true,
        password: passwordHash.generate('123'),
    };
    users.createUser(newUser.email, newUser, function (err, result) {
        if (err) {
            res.send({msg: 'invalid init'})
        } else {
            res.send(result);
        }
    })
})

router.get('/wordgame/wordlist', function (req, res, next) {//init wordlist
    wordlists.saveWordlist(wordArr, function (err, results) {
        res.send(results)
    })
});


router.get('/wordgame', function (req, res, next) {
    res.sendFile('index.html', {root: __dirname + "/../public"});
});


router.get('/wordgame/api/v3/meta', function (req, res, next) {
    metadatas.getMetadata(function (err, result) {
        if (err) {
            res.status(403).json({msg: 'error'});
        }
        res.send(result[0]);
    });
});


router.get('/wordgame/api/v3/meta/fonts', function (req, res, next) {
    metadatas.getMetadata(function (err, result) {
        if (err) {
            res.status(403).json({msg: 'error'});
        }
        res.send(result[0].fonts);
    });
});
router.all('/wordgame/api/v3/users/:userId/*', function (req, res, next) {
    users.findUserByid(req.params.userId, function (error, pathUser) {
        var authenticatedUser = req.session.user;
        var csrf = req.header('csrf');
        if (authenticatedUser && pathUser && pathUser.role == "user" && authenticatedUser._id == pathUser._id && pathUser.status && csrf == req.session.csrf) {
            next();
        } else {
            res.status(403).send('Invalid user');
        }
    })
})

// -----------------------------------------------------------------------------------------------------
router.get('/wordgame/api/v3/users/:userId/games', function (req, res, next) {

    var userId = req.params.userId;
    games.findByUserId(userId, function (err, games) {
        if (err) {
        } else {
            var gamesAfterCheck = new Array();
            games.forEach(game=> {
                gamesAfterCheck.push(checkStatus(game));
            })
            res.json(gamesAfterCheck);
        }
    })
})

router.post('/wordgame/api/v3/users/:userId', function (req, res, next) {//create game


    metadatas.getMetadata(function (err, result) {
        if (err) {
            res.status(403).json({msg: 'error'});
        }
        var metadata = result[0];
        var fontObject;
        var target = chooseWord(metadata.levels[req.query.level]);
        var view = "";
        for (var i = 0 in target) {
            view += "_";
        }
        var fontsList = metadata.fonts;
        for (var i = 0 in fontsList) {
            if (fontsList[i].family == req.header('X-font')) {
                fontObject = fontsList[i];
                break;
            }
        }
        var colors = req.body;

        games.create(colors, fontObject, "", guid(), metadata.levels[req.query.level], metadata.levels[req.query.level].guesses, "unfinished", target, Date.now(), 0, view, req.params.userId, function (err, game) {
            if (err) {
                res.status(500).send({'msg': 'Error creating game'});
            } else {
                res.send(checkStatus(game));
            }
        })

    });
});

router.get('/wordgame/api/v3/users/:userId/:gid', function (req, res, next) {

    var gamesId = req.params.gid;
    games.find(gamesId, function (err, game) {

        if (err) {
            res.status(403).json({msg: 'error'});
        } else {
            res.send(checkStatus(game));
        }
    });
});

router.post('/wordgame/api/v3/users/:userId/:gid/guesses', function (req, res, next) {

    var guess = req.query.guess;
    games.find(req.params.gid, function (err, game) {
        if (err) {
            res.status(403).json({msg: 'error'});
        } else {
            var target = game.target;
            if (target.indexOf(guess.toLowerCase()) != -1) {
                var indexArr = new Array();
                for (var i in target) {
                    if (target[i] == guess.toLowerCase()) {
                        indexArr.push(i)
                    }
                }
                var viewArr = game.view.split("");
                for (var i in indexArr) {
                    viewArr[indexArr[i]] = guess.toLowerCase();
                }
                var newView = viewArr.join("");
                if (newView == game.view) {
                    game.remaining--;
                } else {
                    game.view = newView;
                }
            } else {
                game.remaining--;
            }
            if (game.view.indexOf("_") == -1 && game.remaining >= 0) {
                game.status = "win";
                game.timeToComplete = Date.now() - game.timeStamp;
            }
            if (game.view.indexOf("_") != -1 && game.remaining <= 0) {
                game.status = "loss";
                game.timeToComplete = Date.now() - game.timeStamp;
            }
            game.guesses += guess;

            games.update(game.id, game, function (err, game) {
                if (err) {
                    res.status(403).json({msg: 'error'});
                } else {
                    res.send(checkStatus(game));
                }
            })
        }
    });
});


router.put('/wordgame/api/v3/users/:userId/defaults', function (req, res, next) {
    var userId = req.params.userId;
    var defaults = req.body;
    users.updateDefaultsByID(userId, defaults, function (err, game) {
        if (err) {
            res.status(404).send({"msg": "invalid defaults"})
        } else {
            res.send(defaults)
        }
    })

})

router.all('/wordgame/api/v3/admins/:aid/*', function (req, res, next) {
    users.findUserByid(req.params.aid, function (error, pathUser) {
        var authenticatedUser = req.session.user;
        var csrf = req.header('csrf');

        if (authenticatedUser && pathUser && pathUser.role == "admin" && authenticatedUser._id == pathUser._id && authenticatedUser.status && csrf == req.session.csrf) {
            next();
        } else {
            res.status(403).send('Invalid user');
        }
    })
})

router.get('/wordgame/api/v3/admins/:aid', function (req, res, next) {
    users.findAll(function (err, result) {
        if (err) {
            res.status(403).json({msg: err});
        } else {
            res.send(result);
        }
    })
})

router.put('/wordgame/api/v3/admins/:aid/users/:userId', function (req, res, next) {
    var userId = req.params.userId;
    var newUser = req.body;
    users.updateUser(userId, newUser, function (err, user) {
        if (err) {
            res.send({"msg": "invalid User"})
        } else {
            res.send(user)
        }
    })

})

router.post('/wordgame/api/v3/admins/:aid/users/:userId', function (req, res, next) {
        var userId = req.params.userId;
        var newUser = req.body
        newUser.password = passwordHash.generate(newUser.password);
        users.createUser(userId, newUser, function (err, result) {
            if (err) {
                res.status(403).json({msg: 'can not create a user'});
            } else {
                res.send(result)
            }

        })
    }
)


router.get('/wordgame/api/v3/admins/:aid/search', function (req, res, next) {
        var s = req.query.status;
        var content = req.query.content;
        if (req.query.status == "true") {
            s = true;
        }
        if (req.query.status == "false") {
            s = false
        }
        users.findSpecificUser(s, content, function (err, user) {
            if (err) {
                res.status(403).json({msg: err});
            }
            res.send(user)
        })
    }
)

router.delete('/wordgame/api/v3/admins/:aid/meta/levels', function (req, res, next) {
    metadatas.deleteLevel(req.body, function (err, meta) {
        if (err) {
            res.status(403).json({msg: err});
        }
        res.send(meta)
    });
})

router.put('/wordgame/api/v3/admins/:aid/meta/levels', function (req, res, next) {
    var oldname = req.header('oldname');
    if (oldname == req.body.name || oldname == "") {
        metadatas.updateLevel(oldname, req.body, function (err, meta) {
            if (err) {
                res.status(403).json({msg: err});
            }
            res.send(meta)
        });
    } else {
        metadatas.getMetadata(function (err, result) {
            var metadata = result[0];
            if (metadata.levels[req.body.name]) {
                res.send({msg: "This level name already exists!"})
            } else {
                metadatas.updateLevel(oldname, req.body, function (err, meta) {
                    if (err) {
                        res.status(403).json({msg: err});
                    }
                    res.send(meta)
                });
            }

        })
    }

})

router.delete('/wordgame/api/v3/admins/:aid/meta/fonts', function (req, res, next) {
    metadatas.deleteFonts(req.body, function (err, meta) {
        if (err) {
            res.status(403).json({msg: err});
        }
        res.send(meta)
    });
})

router.put('/wordgame/api/v3/admins/:aid/meta/fonts', function (req, res, next) {
    var oldname = req.header('oldname');

    if (oldname == req.body.family || oldname == "") {
        metadatas.updateFont(oldname, req.body, function (err, meta) {
            if (err) {
                res.status(403).json({msg: err});
            }
            res.send(meta)
        });
    } else {
        metadatas.getMetadata(function (err, result) {
            var metadata = result[0];
            var flag = false;
            metadata.fonts.forEach(font=> {
                if (font.family == req.body.family) {
                    flag = true;
                }
            });
            if (flag) {
                res.send({msg: "Family name already exists!"})
            } else {
                metadatas.updateFont(oldname, req.body, function (err, meta) {
                    if (err) {
                        res.status(403).json({msg: err});
                    }
                    res.send(meta)
                })
            }


        })
    }


})


router.put("/wordgame/api/v3/admins/:aid/meta/defaults/colors", function (req, res, next) {
    metadatas.updateMetaColors(req.body, function (err, meta) {
        if (err) {
            res.status(403).json({msg: err});
        }
        res.send(meta)
    });
})


router.put("/wordgame/api/v3/admins/:aid/meta/defaults", function (req, res, next) {

    metadatas.updateMetaDefault(req.body, function (err, meta) {
        if (err) {
            res.status(403).json({msg: err});
        }
        res.send(meta)
    });
})


function checkStatus(game) {
    if (game.status == "win" || game.status == "loss") {
    } else {
        game.target = "";
        game.timeToComplete = 0;
    }
    return game;
}

module.exports = router;

