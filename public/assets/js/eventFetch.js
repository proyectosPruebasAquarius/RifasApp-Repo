function daemonize(id) {
    const eventSource = new EventSource(`https://brujirifas.com/cart/track/list/${id}`);

    let updateMessage = (message) => {

        /* message.forEach(element => {
            list.innerText = element; parsed   
        }); */
        if (message) {
            let data = JSON.parse(message);
            let parsed = JSON.parse(data[id]);
            console.log('index', iOf);
            let card = document.querySelector('.expand');
            console.log(card);
            if (card == null) {
                eventSource.close();
            }
            assignValueArray(parsed, iOf)
        }
    };

    eventSource.onmessage = (event) => {
        updateMessage(event.data);
    };

    eventSource.onerror = () => {
        updateMessage('No se econtraron datos disponibles');
        eventSource.close();
    };
};

function undaemonize() {
    eventSource.onerror = () => {
        /* updateMessage('No se econtraron datos disponibles'); */
        eventSource.close();
    };
}