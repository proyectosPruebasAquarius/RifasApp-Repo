var express = require("express");
const dateFormat = require("dateformat");
const pool = require("../config/db.config");
const Cart = require("../config/cart");


// redis
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const axios = require('axios').default;
var router = express.Router();

router.get('/add-to-cart/:id', async function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var product = await pool.query('select a.*, b.nombre as rifa, c.precio as precio, c.id as id_boleto from publicaciones as a inner join rifas as b on a.id_rifa = b.id inner join boletos as c on c.id_rifa = b.id where a.id = ?', productId, (err, result) => {
        if (err) { return res.redirect('/'); }
        cart.add(result[0], result[0].id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/inicio')
    });
});

router.get('/carrito', (req, res) => {

    res.render("publics_views/carts/cart.ejs", {
        title: "Carrito de Compras - Bruji Rifas",
        productos: req.app.locals.productos,
        totalPrice: req.app.locals.totalPrice,
        boletos: req.app.locals.boletos,
    });
});

router.get('/qty/:length/:value', function(req, res) {
    let i = req.params.length;
    let valor = req.params.value;
    console.log(i)
        ///console.log(req.session.cart.items[i].item.qty = valor)
        /*req.app.locals.productos[i].qty = valor
        console.log({qty: req.app.locals.productos[i].qty, productos: req.app.locals.productos[i]})*/
})

router.get('/remove/:id', async (req, res) => {
    var productoId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    let products = req.app.locals.productos
    let pp = {};
    
    let f = products.filter(p => p.item.id == productoId);

    if (f[0].No.length > 0) {
        var valu = await client.get(`${f[0].item.id_rifa}`);
        console.log('awai', valu);

        //console.log('better now', reply);
        let oldArr = JSON.parse(valu);
        console.log('much better now', oldArr);
        let oldArrParsed = JSON.parse(oldArr[f[0].item.id_rifa]);
        if (oldArrParsed instanceof Array) {
            console.log('true');
        }
        console.log('much better right now', oldArrParsed);

        for (let index = 0; index < f[0].No.length; index++) {
            const e = f[0].No[index];

            console.log('numerosoos', e);

            oldArrParsed.push(parseInt(e));
            oldArrParsed.sort((a, b) => a - b);

            if (Object.keys(pp).length > 0) {
                pp = {};
                pp[f[0].item.id_rifa] = JSON.stringify(oldArrParsed);
                //await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
            } else {
                pp[f[0].item.id_rifa] = JSON.stringify(oldArrParsed);
            }

            await client.set(`${f[0].item.id_rifa}`, JSON.stringify(pp));
        }

        let latest = await client.get(`${f[0].item.id_rifa}`)
        console.log('el ultimo', latest);
    }

    cart.remove(productoId);
    req.session.cart = cart;
    res.redirect('back');
})

router.get('/addNumber/:id/:number', function(req, res) {
    var productoId = req.params.id;
    var numero = req.params.number;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.addNumbers(productoId, numero);
    req.session.cart = cart;
    res.redirect('back');
})

router.get('/adder/:number', function(req, res) {
    var productoId = req.params.array;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    /* console.log('elarraya',productoId);
    console.log('elarraya',cart); */
    cart.addNumbers(id, number);

})

router.get('/reducer/:id', function(req, res) {
    var productoId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productoId);
    req.session.cart = cart;
    //console.log({riot: req.session.cart.items[id]})
    res.redirect('back');
});

router.get('/drop', function(req, res) {
    delete req.session.cart;
    res.redirect('back');
})

//destruye la sesion del carrito y regresa los numeros a bd despues de 15 mins
router.get('/destroy/session_cart', async(req, res) => {
        let products = req.app.locals.productos
        let pp = {};
        console.log('prddd', products, 'lenght', products.length);
        //await timeOut(60000);
        for (let i = 0; i < products.length; i++) {
            const element = products[i];

            if (element.No.length > 0) {
                var valu = await client.get(`${element.item.id_rifa}`);
                console.log('awai', valu);

                //console.log('better now', reply);
                let oldArr = JSON.parse(valu);
                console.log('much better now', oldArr);
                let oldArrParsed = JSON.parse(oldArr[element.item.id_rifa]);
                if (oldArrParsed instanceof Array) {
                    console.log('true');
                }
                console.log('much better right now', oldArrParsed);

                for (let index = 0; index < element.No.length; index++) {
                    const e = element.No[index];

                    console.log('numerosoos', e);

                    oldArrParsed.push(parseInt(e));
                    oldArrParsed.sort((a, b) => a - b);

                    if (Object.keys(pp).length > 0) {
                        pp = {};
                        pp[element.item.id_rifa] = JSON.stringify(oldArrParsed);
                        //await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
                    } else {
                        pp[element.item.id_rifa] = JSON.stringify(oldArrParsed);
                    }

                    await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
                }

                let latest = await client.get(`${element.item.id_rifa}`)
                console.log('el ultimo', latest);
                //     let latestParsed = JSON.parse(latest);
                //req.app.io.emit('update', { key: element.item.id_rifa, array: latestParsed });
            }
        }
        //delete req.session.cart; 
        /* if (products != null && products.length > 0) { 
            await timeOut(6000); 
            redisConfig(client,products);
            console.log('prdddasdas');
        } */
    })
    //remueve elementos del array de numeros del carrito
router.get('/removeFromArray/:key/:number', async(req, res) => {
    let key = req.params.key;
    let number = req.params.number;
    let pp = {};
    let query = await client.get(`${key}`);

    let data = JSON.parse(query);
    let dataParsed = JSON.parse(data[key]);

    if (dataParsed.includes(number)) {
        console.log('response ok');
    } else {
        console.log('not include')
        dataParsed.push(parseInt(number));
        dataParsed.sort((a, b) => a - b);

        pp[key] = JSON.stringify(dataParsed);
        await client.set(`${key}`, JSON.stringify(pp));

        let latest = await client.get(`${key}`)

        let latestParsed = JSON.parse(latest);
        req.app.io.emit('reassigned', { key: key, array: latestParsed });
    }
})

// Envia la lista cada segundo SSE
router.get('/track/list/:id', async(req, res) => {
    let id = req.params.id;

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE with client

    let counter = 0;
    /*  let boletos = await pool.query('select a.*, b.id_rifa as boletos, b.num_inicial , b.num_final from Detalle_venta as a inner join boletos as b on a.id_boleto = b.id where b.id_rifa = ?', idRifa)
     let numbers = await pool.query('select num_inicial, num_final from boletos where id_rifa = ?', idRifa)
     let data =  boletos.length > 0 ? boletos : numbers; */
    let data = await client.get(`${id}`)
    if (data) {
        console.log('daaaa', data);
        let interValID = setInterval(() => {
            let refresh = standarFetch(id);
            refresh.then((value) => {
                //console.log(value);
                res.write(`data: ${value}\n\n`); // res.write() instead of res.send()
                // expected output: 123
            });
            //console.log('daaassa', refresh);
            /* if (counter >= 10) {
                clearInterval(interValID);
                res.end(); // terminates SSE session
                return;
            } */

        }, 1000);

        res.on('close', () => {
            console.log('client dropped me');
            clearInterval(interValID);
            res.end();
        });
    } else {
        let array = [];
        axios.get(`https://brujirifas.com/cart/boletos/${id}`)
            .then(data => {
                //console.log(res)

                console.log('logistica', data.data);

                let firts = createRangeOfNumbers(data.data[0].num_inicial, data.data[0].num_final)
                firts.forEach(f => {
                    array.push(f)
                });

                if (typeof data.data[0].numero !== 'undefined') {
                    data.data.forEach(d => {
                        array = removeSellNumbers(array, d.numero)
                    });
                }


                /*                 console.log('im here', pp);
                                console.log('im here key', id); */
                standarSet(id, array);
                let interValID = setInterval(() => {
                    let refresh = standarFetch(id);
                    refresh.then((value) => {
                        //console.log(value);
                        res.write(`data: ${value}\n\n`); // res.write() instead of res.send()
                        // expected output: 123
                    });
                }, 1000)
            })
            .catch(err => {
                console.error(err);
            })


    };

    /* let interValID = setInterval(() => {
        counter++;
        if (counter >= 10) {
            clearInterval(interValID);
            res.end(); // terminates SSE session
            return;
        }
        res.write(`data: ${JSON.stringify({num: counter})}\n\n`); // res.write() instead of res.send()
    }, 1000); */

    // If client closes connection, stop sending events
    /* res.on('close', () => {
        console.log('client dropped me');
        clearInterval(interValID);
        res.end();
    }); */
})
let standarSet = async(id, array) => {
    let pp = {};
    if (Object.keys(pp).length > 0) {
        pp = {};
        console.log('fue aqui');
        pp[id] = JSON.stringify(array);
        //await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
    } else {
        console.log('fue ', JSON.stringify(array));
        pp[id] = JSON.stringify(array);
    }
    console.log('datos', pp);
    let data = await client.set(`${id}`, JSON.stringify(pp));
    return data;
}

function createRangeOfNumbers(initial, end) {
    let array = []
        /*while (initial < end) {
            array=[initial++]
        } */
    for (initial; initial <= end; initial++) {
        array.push(initial)

    }
    return array
}
let standarFetch = async(id) => {
    let data = await client.get(`${id}`);
    return data;
}

router.get('/addAnArray/:id/:number', async(req, res) => {
    let key = req.params.id;
    let number = req.params.number;
    let pp = {};
    /* let {
        arrays
    } = req.body; */


    ///console.log('locxo', array);

    let firts = await client.get(`${key}`);
    let second = JSON.parse(firts);
    let third = JSON.parse(second[key]);

    let arrays = removeSellNumbers(third, parseInt(number));

    console.log('virus', arrays);
    if (Object.keys(pp).length > 0) {
        pp = {};
        pp[key] = JSON.stringify(arrays);
        //await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
    } else {
        pp[key] = JSON.stringify(arrays);
    }
    console.log('im here', pp);
    console.log('im here key', key);
    await client.set(`${key}`, JSON.stringify(pp));
    res.sendStatus(200);
})

function removeSellNumbers(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] == value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}




// ---API ANDROID--- 

router.get('/rifas/all', async function(req, res) {
    var productos = await pool.query('select a.*, b.nombre as rifa, b.imagen as imagen from boletos as a inner join rifas as b on a.id_rifa = b.id')
    res.send({ data: productos });
})

// Details
router.get('/rifas/:id', async function(req, res) {
    var id = req.params.id
    var productos = await pool.query('select a.*, b.nombre as rifa, b.imagen as imagen from boletos as a inner join rifas as b on a.id_rifa = b.id where a.id = ?', id)
    res.send({ data: productos });
})

// Publicaciones
router.get('/posts/all', async(req, res) => {
        const posts = await pool.query('select a.*, b.nombre as rifa, c.precio as precio from publicaciones as a inner join rifas as b on a.id_rifa = b.id inner join boletos as c on c.id_rifa = b.id');
        res.send({ data: posts })
    })
    // 
let results = [];

function getFetch(params) {
    results = params;
}

// Carrito para android;
router.get('/android/cart', async (req, res) => {
    let data = {
        productos: req.app.locals.productos,
        totalPrice: req.app.locals.totalPrice,
        boletos: req.app.locals.boletos,
        totalQty: req.session.hasOwnProperty('cart') ? req.session.cart.totalQty : 0
    };

    res.send(await data);
});

router.get('/boletos/:id_rifa', async(req, res) => {
    var idRifa = req.params.id_rifa;


    client.get('arrays', (err, reply) => {
        if (err) throw err;
        console.log(JSON.parse(reply));
        //io.emit('oo', JSON.parse(reply))
        let result = JSON.parse(reply)
        if (result != null) {

            if (typeof result[idRifa] !== 'undefined') {
                getFetch(result[idRifa]);
            }

        }
    });


    let boletos = await pool.query('select a.*, b.id_rifa as boletos, b.num_inicial , b.num_final from detalle_venta as a inner join boletos as b on a.id_boleto = b.id where b.id_rifa = ?', idRifa)
    let numbers = await pool.query('select num_inicial, num_final from boletos where id_rifa = ?', idRifa)
    req.app.locals.boletos = boletos.length > 0 ? boletos : numbers;

    console.log('desde ruta:', req.app.locals.boletos)

    res.status(200).send(req.app.locals.boletos)
    return;
})
router.get('/creator/:id', async(req, res) => {
    let key = req.params.id;
    let data = await client.get(`${key}`);

    res.send(data);
})

router.get('/isLoggedIn', async(req, res) => {

    if (req.user) {res.send(`usuario ${req.user}`)} else { res.send('adios')}

});

router.get('/hola/:id', async(req, res) => {
    
        let id = req.params.id;
    
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // flush the headers to establish SSE with client
    
        let counter = 0;
        var wasChanged;
        /*  let boletos = await pool.query('select a.*, b.id_rifa as boletos, b.num_inicial , b.num_final from Detalle_venta as a inner join boletos as b on a.id_boleto = b.id where b.id_rifa = ?', idRifa)
         let numbers = await pool.query('select num_inicial, num_final from boletos where id_rifa = ?', idRifa)
         let data =  boletos.length > 0 ? boletos : numbers; */
        let data = await client.get(`${id}`)
        if (data) {
            console.log('daaaa', data);
            let interValID = setInterval(() => {
                let refresh = standarFetch(id);
                refresh.then((value) => {
                    //console.log(value);
                    if (value == wasChanged) {
                        console.log('i dont changed');
                    } else {

                        wasChanged = value;
                        res.write(`data: ${value}\n\n`); // res.write() instead of res.send()
                        
                    }
                   // res.write(`data: ${value}\n\n`); // res.write() instead of res.send()
                    // expected output: 123
                });
                //console.log('daaassa', refresh);
                /* if (counter >= 10) {
                    clearInterval(interValID);
                    res.end(); // terminates SSE session
                    return;
                } */
    
            }, 1000);
    
            res.on('close', () => {
                console.log('client dropped me');
                clearInterval(interValID);
                res.end();
            });
        } else {
            //startProcess(id)                
            let array = [];
            axios.get(`https://burjirifas.com/cart/boletos/${id}`)
            .then(data => {
                //console.log(res)
                
                console.log('logistica', data.data);
    
                    let firts = createRangeOfNumbers(data.data[0].num_inicial, data.data[0].num_final)
                    firts.forEach(f => {
                        array.push(f)
                    });
                    
                    if (typeof data.data[0].numero !== 'undefined') {
                        data.data.forEach(d => {
                            array = removeSellNumbers(array, d.numero)                            
                        });
                    }
                                       
                    
    /*                 console.log('im here', pp);
                    console.log('im here key', id); */
                    standarSet(id, array);
                    let interValID = setInterval(() => {
                        let refresh = standarFetch(id);
                        refresh.then((value) => {
                                //console.log(value);
                            res.write(`data: ${value}\n\n`); // res.write() instead of res.send()
                                // expected output: 123
                        });
                    },1000)
            })
            .catch(err => {
                console.error(err); 
            })
            
            
        };    

})

// Función Push Android
router.get('/android/pushNo/:id/:number', async (req, res) => {

    let id = req.params.id;
    let number = req.params.number;
    let cart = req.app.locals.productos;

    for (let i = 0; i < cart.length; i++) {
        const element = cart[i];
        if (element.item.id == id) {
            cart = element
        }
        
    }
    console.log(`${JSON.stringify(cart)}`);    
    if (cart.No.length == cart.qty) {
        console.log('ya entre log');
    } else{
        if (cart.No.find(e => e == number)) { 
                  
            const callback1 = axios.get(`https://brujirifas.com/removeFromArray/${cart.item.id_rifa}/${number}`)                                                
            const callback2 = axios.get(`https://brujirifas.com/addNumber/${id}/${number}`)
            
           await axios.all([callback1,callback2])
            .then(axios.spread((res1, res2)=>{
            }))
                     
        } else {            

           await axios.get(`https://brujirifas.com/addNumber/${id}/${number}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err); 
            })
            
        }
    }

    res.send(req.session.cart);
})


router.get('/remove/android/:id', async (req, res) => {
    let id = req.params.id;
    let products = req.app.locals.productos
    let pp = {};
    let f = products.filter(p => p.item.id == id);

    if (f.No.length > 0) {
        var valu = await client.get(`${f.item.id_rifa}`);
        console.log('awai', valu);

        //console.log('better now', reply);
        let oldArr = JSON.parse(valu);
        console.log('much better now', oldArr);
        let oldArrParsed = JSON.parse(oldArr[f.item.id_rifa]);
        if (oldArrParsed instanceof Array) {
            console.log('true');
        }
        console.log('much better right now', oldArrParsed);

        for (let index = 0; index < f.No.length; index++) {
            const e = f.No[index];

            console.log('numerosoos', e);

            oldArrParsed.push(parseInt(e));
            oldArrParsed.sort((a, b) => a - b);

            if (Object.keys(pp).length > 0) {
                pp = {};
                pp[f.item.id_rifa] = JSON.stringify(oldArrParsed);
                //await client.set(`${element.item.id_rifa}`, JSON.stringify(pp));
            } else {
                pp[f.item.id_rifa] = JSON.stringify(oldArrParsed);
            }

            await client.set(`${f.item.id_rifa}`, JSON.stringify(pp));
        }

        let latest = await client.get(`${f.item.id_rifa}`)
        console.log('el ultimo', latest);
    }
    res.send(f);
})

module.exports = router;