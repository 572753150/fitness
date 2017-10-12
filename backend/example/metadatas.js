/**
 * Created by apple on 2017/3/25.
 */
var Metadata = require('./metadataModel');


function saveMetadata(levels, fonts, defaults, cb) {//need to be considered
    new Metadata({'levels': levels, 'fonts': fonts, 'defaults': defaults}).save(cb);
};
module.exports.saveMetadata = saveMetadata;


function getMetadata(cb) {
    Metadata.find({}, cb)
};
module.exports.getMetadata = getMetadata;


function deleteLevel(level, cb) {
    Metadata.find({}, function (err, result) {
        if (err) {
            cb(err, null)
        } else {
            delete result[0].levels[level.name];
            result[0].markModified("levels");
            result[0].save(cb);
        }
    })

}
module.exports.deleteLevel = deleteLevel;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteFonts(fontDel, cb) {
    Metadata.find({}, function (err, result) {
        if (err) {
            cb(err, null)
        } else {
            for (var i = 0; i < result[0].fonts.length; i++) {
                if (result[0].fonts[i].family == fontDel.family) {
                    result[0].fonts.splice(i, 1);
                }
            }
            result[0].save(cb);
        }
    })

}
module.exports.deleteFonts = deleteFonts;

function updateLevel(oldName, level, cb) {
    Metadata.find({}, function (err, result) {
        if (err) {
            cb(err, null)
        } else {
            if (result[0].levels[oldName]) {
                delete result[0].levels[oldName];

            }
            result[0].levels[level.name] = level;
            result[0].markModified("levels");
            result[0].save(cb);
        }
    })

}

module.exports.updateLevel = updateLevel;

function updateFont(oldName, fontUp, cb) {
    Metadata.find({}, function (err, result) {
            if (err) {
                console.log(err);
                cb(err, null)
            } else {
                if (oldName == '') {
                    result[0].fonts.push(fontUp);
                    result[0].save(cb);
                    return;
                }
                for (var i = 0; i < result[0].fonts.length; i++) {
                    if (result[0].fonts[i].family == oldName) {
                        result[0].fonts.splice(i,1,fontUp)
                    }
                }
                result[0].save(cb);
            }
        }
    )

}

module.exports.updateFont = updateFont;

function updateMetaColors(colors, cb) {
    Metadata.find({}, function (err, result) {
        if (err) {
            cb(err, null)
        } else {
            result[0].defaults.colors = colors;
            result[0].save(cb)
        }
    })
}
module.exports.updateMetaColors = updateMetaColors;


function updateMetaDefault(defaultsObj, cb) {
    Metadata.find({}, function (err, result) {
        if (err) {
            cb(err, null)
        } else {
            result[0].defaults = defaultsObj;
            result[0].save(cb)
        }
    })
}
module.exports.updateMetaDefault = updateMetaDefault;


