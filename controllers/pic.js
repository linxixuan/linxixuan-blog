var fs = require('fs'),
    imgSize = require('image-size');

var commonData;

module.exports = function(app){
    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg',
    };

    // 图库
    app.get('/pic', function (req, res) {
        var data = commonData,
            galleryPath = 'public/gallery',
            foldPaths,
            picPaths,
            firstPic,
            foldList = [],
            picList = [];
        if (!req.query.fold) {
            foldPaths = fs.readdirSync(galleryPath);
            for (var i = 0,len = foldPaths.length; i < len; i++) {
                if (foldPaths[i] !== '.DS_Store') {
                    if (fs.readdirSync(galleryPath + '/' + foldPaths[i])[0] === '.DS_Store') {
                        firstPic = fs.readdirSync(galleryPath + '/' + foldPaths[i])[1];
                    } else {
                        firstPic = fs.readdirSync(galleryPath + '/' + foldPaths[i])[0];
                    }
                    firstPic = 'gallery/' +  foldPaths[i] + '/' + firstPic;
                    foldList.push({
                        'name': foldPaths[i],
                        'firstPic': firstPic,
                    });
                }
            }
        } else {
            var fold = req.query.fold,
                dimension;
            picPaths = fs.readdirSync(galleryPath + '/' + fold);
            for (var i = 0,len = picPaths.length; i < len; i++) {
                if (picPaths[i] !== '.DS_Store') {
                    dimension = imgSize('public/gallery/' + fold + '/' + picPaths[i]);

                    picList.push({
                        'name': picPaths[i].replace(/\.\S+/g, ''),
                        'imgSrc': 'gallery/' + fold + '/' + picPaths[i],
                        'width': dimension.width,
                        'height': dimension.height
                    });
                }
            }
        }

        // 渲染数据填充
        data.foldList = foldList;
        data.picList = picList;
        res.render('pic', data);
    });
};
