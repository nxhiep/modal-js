class Modal {
    html = `
    <div class="my-modal-content">
        <div class="my-modal-header">
            <div class="title"></div>
            <span class="close">&times;</span>
        </div>
        <div class="my-modal-body">
            <p>Some text in the Modal..</p>
        </div>
        <div class="my-modal-footer">
            <button class="button-ok">Ok</button>
            <button class="button-cancel">Cancel</button>
        </div>
    </div>`;

    options = {
        title: 'Notification',
        body: '',
        okText: 'Ok',
        cancelText: 'Cancel',
        onConfirm: null,
        autoHide: true,
        sizeAuto: false,
        onHide: null
    }

    constructor(options){
        this.setOptions(options);
        this.modal = document.createElement('div');
        this.modal.className = 'hiepnx-modal';
        this.modal.innerHTML = this.html;
        this.content = this.modal.querySelector('.my-modal-content');
        this.titleHTML = this.modal.querySelector('.title');
        this.header = this.modal.querySelector('.my-modal-header');
        this.body = this.modal.querySelector('.my-modal-body');
        this.footer = this.modal.querySelector('.my-modal-footer');
        this.close = this.modal.querySelector('.close');
        this.buttonOk = this.modal.querySelector('.button-ok');
        this.buttonCancel = this.modal.querySelector('.button-cancel');
        this.modal.onclick = (e) => {
            let className = e && e.target ? e.target.className : '';
            if(className && typeof className === 'string' 
                && (className.indexOf('hiepnx-modal') > -1 || className.indexOf('close') > -1)){
                this.hide();
            }
            if(className.indexOf('button-ok') > -1){
                this.options.autoHide && this.hide();
                this.options.onConfirm && this.options.onConfirm(true);
            }
            if(className.indexOf('button-cancel') > -1){
                this.options.autoHide && this.hide();
                this.options.onConfirm && this.options.onConfirm(false);
            }
        }
        if(!this.options.sizeAuto){
            this.content.classList.add('size-auto');
        } else {
            this.content.classList.remove('size-auto');
        }
    }

    show(options) {
        this.setOptions(options);
        this.animateDisplay(true);
        if(this.options.title){
            this.titleHTML.innerHTML = this.options.title;
        } else if(this.options.title === null) {
            this.titleHTML.remove();
        }
        if(this.options.okText){
            this.buttonOk.innerHTML = this.options.okText;
        }
        if(this.options.cancelText){
            this.buttonCancel.innerHTML = this.options.cancelText;
        }
        if(this.options.okText === null && this.options.cancelText === null){
            this.footer.remove();
        }
        if(typeof this.options.body === 'string'){
            this.body.innerHTML = this.options.body;
        } else if(typeof this.options.body === 'object'){
            this.body.innerHTML = this.options.body.outerHTML;
        }
        return this;
    }

    center(options) {
        this.modal.classList.add('center');
        this.show(options);
    }

    hide() {
        this.animateDisplay(false);
        this.options.onHide && this.options.onHide();
    }

    onHide(callback) {
        this.options.onHide = callback;
    }

    setOptions(opts){
        if(opts){
            this.options = {...this.options, ...opts};
        }
    }

    animateDisplay(show) {
        if(this.open && show){
            return;
        }
        this.open = show;
        if(show){
            document.body.appendChild(this.modal);
            let opacity = 0;
            this.modal.style.opacity = 0;
            let interval = setInterval(() => {
                opacity += 0.1;
                this.modal.style.opacity = opacity;
                if(opacity >= 1){
                    clearInterval(interval);
                }
            }, 10);
        } else {
            let opacity = 1;
            let interval = setInterval(() => {
                opacity -= 0.1;
                this.modal.style.opacity = opacity;
                if(opacity <= 0){
                    clearInterval(interval);
                    this.modal.remove();
                }
            }, 10);
        }
    }
}

class Notification extends Modal {
    constructor(){
        super();
        this.modal.classList.add('notification');
        this.header.remove();
        this.footer.remove();
        this.content.style.borderRadius = '15px';
        this.body.style.textAlign = 'center';
        this.content.style.minWidth = '400px';
        this.content.style.maxWidth = '400px';
        this.iconColor = '#4da7f6';
        this.icon = `
        <svg aria-hidden="true" focusable="false" data-prefix="fal" 
            data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle fa-w-16">
                <path fill="`+this.iconColor+`" d="M256 40c118.621 0 216 96.075 216 216 0 
                    119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 
                    96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 
                    248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 
                    344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 
                    0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 
                    0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 
                    32 32 32 32-14.327 32-32-14.327-32-32-32z" class="">
                </path>
        </svg>`;
        this.notificationPanel = document.createElement('div');
    }

    showNotification(msg, showNow) {
        this.msg = msg;
        let iconElement = document.createElement('div');
        iconElement.innerHTML = this.icon;
        iconElement.className = 'icon-panel'
        let msgElement = document.createElement('div');
        msgElement.innerHTML = msg;
        msgElement.style.color = this.iconColor;// TODO: textColor == iconColor
        msgElement.className = 'msg-panel';
        let contentPanel = document.createElement('div');
        contentPanel.className = 'content-notification-panel';
        contentPanel.appendChild(iconElement);
        contentPanel.appendChild(msgElement);
        contentPanel.appendChild(this.close);
        this.close.classList.add('close-noti');
        this.notificationPanel.appendChild(contentPanel);
        this.setOptions({
            body: this.notificationPanel
        });
        showNow !== false && this.center();
    }
}

class ShowInfo extends Notification {
    constructor(msg){
        super();
        msg && this.showNotification(msg);
    }
}

class ShowError extends Notification {
    constructor(msg){
        super();
        this.iconColor = 'red';
        this.icon = `
        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="times-circle" 
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
            class="svg-inline--fa fa-times-circle fa-w-16">
            <path fill="`+this.iconColor+`" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 
                248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 
                118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 
                69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 
                69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 
                0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 
                8.5c4.6 4.7 4.6 12.3 0 17z" class="">
            </path>
        </svg>`;
        msg && this.showNotification(msg);
    }
}

class ShowSuccess extends Notification {
    constructor(msg){
        super();
        this.iconColor = 'green';
        this.icon = `
        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="check-circle" 
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
            class="svg-inline--fa fa-check-circle fa-w-16">
                <path fill="`+this.iconColor+`" d="M256 8C119.033 8 8 119.033 8 256s111.033 
                    248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 
                    0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 
                    96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 
                    4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 
                    12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 
                    8.52c4.668 4.705 4.637 12.303-.068 16.97z" class="">
                </path>
        </svg>`;
        msg && this.showNotification(msg);
    }
}

class ShowWarning extends Notification {
    constructor(msg){
        super();
        this.iconColor = '#ff8a00';
        this.icon = `
        <svg aria-hidden="true" focusable="false" data-prefix="fal" 
            data-icon="exclamation-circle" role="img" xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 512 512" class="svg-inline--fa fa-exclamation-circle fa-w-16">
                <path fill="`+this.iconColor+`" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 
                    216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 
                    8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 
                    392.957 8 256 8zm-11.49 120h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 
                    6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 
                    5.167-12.5 11.99-12.5zM256 340c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 
                    28-28-12.536-28-28-28z" class="">
                </path>
        </svg>`;
        msg && this.showNotification(msg);
    }
}

class ShowQuestion extends Notification {
    constructor(msg, okText, cancelText, callback){
        super();
        this.iconColor = 'blue';
        this.icon = `
        <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="question-circle" 
            role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" 
            class="svg-inline--fa fa-question-circle fa-w-16">
                <path fill="`+this.iconColor+`" d="M256 340c-15.464 0-28 12.536-28 28s12.536 28 
                    28 28 28-12.536 28-28-12.536-28-28-28zm7.67-24h-16c-6.627 0-12-5.373-12-12v-.381c0-70.343 
                    77.44-63.619 77.44-107.408 0-20.016-17.761-40.211-57.44-40.211-29.144 0-44.265 
                    9.649-59.211 28.692-3.908 4.98-11.054 5.995-16.248 2.376l-13.134-9.15c-5.625-3.919-6.86-11.771-2.645-17.177C185.658 
                    133.514 210.842 116 255.67 116c52.32 0 97.44 29.751 97.44 80.211 0 67.414-77.44 63.849-77.44 
                    107.408V304c0 6.627-5.373 12-12 12zM256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 
                    216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 
                    119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 
                    256 8z" class="">
                </path>
        </svg>`;
        this.setOptions({
            okText: okText,
            cancelText: cancelText,
            onConfirm: callback
        });
        msg && this.showNotification(msg);
    }
    showNotification(msg) {
        super.showNotification(msg, false);
        let controlsPanel = document.createElement('div');
        controlsPanel.appendChild(this.buttonOk);
        controlsPanel.appendChild(this.buttonCancel);
        this.notificationPanel.appendChild(controlsPanel);
        this.center();
    }
}