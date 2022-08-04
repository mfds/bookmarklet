(() => {
    const element = document.querySelector("div[role='group']");
    if (element) {
        document.getElementsByTagName('html')[0].style.overflow = null;
        element.remove();
    }
})()
