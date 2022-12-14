(function BHload() {
    'use strict';
    const updateTime = "卡巴姆特mobile 最後更新時間:2022/11/19 07:10";
    try {
        var test = app.translator.translations["fof-gamification.forum.ranking.amount"];
        flarum.core.app.translator.addTranslations({
            "kabamut.name": "卡巴姆特",
        });
    }
    catch {
        setTimeout(BHload, 1000);
        return;
    }

    (() => {
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://123ldkop.github.io/kater-baha/mobileStyle.css';
        document.head.appendChild(style);
    })();

    const welcomeImage = (() => {
        const img = document.createElement('img');
        img.className = "BH_welcomeImage";
        img.src = "https://123ldkop.github.io/kater-baha/welcomeImage.webp";

        return {
            append: () => {
                if (location.pathname.replace(/\//, '') != "") return;
                const home = document.querySelector('.IndexPage .container');
                if (home == null || home.querySelector('.BH_welcomeImage')) return;
                home.insertBefore(img, home.querySelector('div'));
            }
        }
    })();

    (function PreviewImage() {
        (function getItems() {
            Timer(getItems,1000);
            if (document.querySelector('.DiscussionListItem')) {
                const items = Array.prototype.slice.call(document.getElementsByClassName('DiscussionListItem'));
                items.map(item => {
                    item.classList.remove('DiscussionListItem');
                    item.classList.add('BH_DiscussionListItem');
                    setPreviewImage(item);
                });
            }
        })();

        async function setPreviewImage(element) {
            const id = element.parentNode.dataset.id;
            const discussion = app.store.data.discussions[id];
            const post = discussion.data.relationships.firstPost.data.id;
            const content = app.store.data.posts[post].data.attributes.contentHtml;
            const temp = document.createElement('div');
            temp.innerHTML = content;
            const img = temp.querySelector('img');
            if (img) {
                const previewImg = document.createElement('img');
                previewImg.className = 'BH_previewImg';
                previewImg.src = img.src;
                previewImg.addEventListener('error',() => {
                    previewImg.style.display = 'none';
                });
                element.appendChild(previewImg);
            }
        }
        
    })();

    const Session = (() => {
        var header;
        try {
            header = document.getElementById('header-secondary').getElementsByClassName('Header-controls')[0];

        }
        catch {
            setTimeout(1000, Session);
            return;
        }
        if (document.querySelector('.item-settings') == null) {
            setTimeout(1000, Session);
            return;
        }
        const sessionItem = document.querySelector('.item-session');
        const sessionMenu = sessionItem.querySelector('.Dropdown-menu');
        sessionMenu.className = 'BH_item-session';

        const items = document.createElement('div');
        header.appendChild(items);
        header.appendChild(sessionMenu);

        return {
            load:() => {
                const itemNav = document.querySelector('.item-nav .ButtonGroup .Dropdown-menu');

                if (itemNav) {
                    items.innerHTML = "";
                    itemNav.className = 'BH_item-select';
                    items.appendChild(itemNav);
                }
            }
        }
    })();

    const NewDiscussion = (() => {
        const btn = document.createElement('div');
        btn.className = 'BH_item-newDiscussion';
        document.querySelector('#app').appendChild(btn);
        btn.addEventListener('click',() => {
            const newDiscussion = document.querySelector('.item-newDiscussion');
            
            if (newDiscussion) newDiscussion.querySelector('button').click();
            
        });
        return {
            visible:(v) => btn.style.display = (v)? 'block':'none'
        }
    })();

    const Notification = (() => {
        const notificationBtn = document.createElement('div');
        notificationBtn.className = 'BH_item-notification';

        const notificationNum = document.createElement('span');
        notificationNum.className = 'BH_notificationNum';

        document.querySelector('#app').appendChild(notificationBtn);
        notificationBtn.appendChild(notificationNum);
        
        (function getNotification() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET','https://kater.me/api/notifications?page%5Boffset%5D=0&include');
            xhr.setRequestHeader('X-CSRF-Token',app.session.csrfToken);
            xhr.onload = () => {
                const res = JSON.parse(xhr.response);
                var num = 0;
                Object.values(res.data).map(notification => {
                    if (notification.attributes.isRead == false) num++;
                });
                if (num != 0) {
                    notificationNum.innerText = num;
                    notificationNum.style.display = 'block';
                }
            };
            xhr.send();
        })();

        notificationBtn.addEventListener('click',() => {
            try {
                document.querySelector('#app-navigation button').click();
                document.querySelector('.item-notifications button').click();
                notificationNum.style.display = 'none';
            }
            catch {}
        });

        return {
            visible:(v) => notificationBtn.style.display = (v)? 'block':'none'
        }
    })();

    var temp;
    (function pageCheck() {
        Timer(pageCheck, 1000);
        var path = location.pathname;
        welcomeImage.append();
        if (path == temp) return;
        const url = location.pathname.split('/');
        switch (url[1]) {
            case "t":
            case "":
                NewDiscussion.visible(true);
                Notification.visible(true);
                Session.load();
                break;
            case "u":
                Session.load();
                NewDiscussion.visible(false);
                Notification.visible(true);
                break;
            case "d":
                NewDiscussion.visible(true);
                Notification.visible(false);
                break;
            case "settings":
                NewDiscussion.visible(false);
                Notification.visible(true);
                break;
            default:
                NewDiscussion.visible(false);
                Notification.visible(false);
                break;
        }
        temp = path;
    })();

    function Timer(call, t) {
        if (t == null) window.requestAnimationFrame(call);
        else setTimeout(() => window.requestAnimationFrame(call), t);
    }
})();