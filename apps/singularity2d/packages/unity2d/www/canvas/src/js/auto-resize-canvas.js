
window.addEventListener('resize', resizeImage);
function resizeImage() {
    const image = document.getElementById('neural-net-graph-view');
    if (window.innerWidth / window.innerHeight > image.width / image.height) {
        image.style.width = 'auto';
        image.style.height = '100%';
    } else {
        image.style.width = '100%';
        image.style.height = 'auto';
    }
    // if (window.innerWidth / window.innerHeight > image.width / image.height) {
    // 	image.style.width = 'calc(100% - 4rem)';
    // 	image.style.height = 'calc(100% - 6rem)';
    // 	image.style.marginLeft = '2rem';
    // 	image.style.marginTop = '3rem';
    // } else {
    // 	image.style.width = 'calc(100% - 6rem)';
    // 	image.style.height = 'calc(100% - 4rem)';
    // 	image.style.marginLeft = '3rem';
    // 	image.style.marginTop = '2rem';
    // }
}
// Initial resize
resizeImage();
