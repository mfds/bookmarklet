(() => {
    const videos = document.getElementsByTagName('video');
    const activeVideo = [].find.call(videos, (v) => !v.paused);
    if (activeVideo) {
        navigator.clipboard.writeText(activeVideo.src);
    }
})()