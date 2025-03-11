// Local Storage Helper Functions
const localStorage = {
    getToken: () => window.localStorage.getItem('token'),
    saveToken: (token) => window.localStorage.setItem('token', token),
    saveSpeakData: (speakData) => window.localStorage.setItem('speakData', speakData),
    getSpeakData: () => window.localStorage.getItem('speakData')
};

// URL Parameter Handling
const handleURLParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const speakData = urlParams.get('speakData');

    // Handle token if present
    if (token) {
        localStorage.saveToken(token);
        urlParams.delete('token');
        window.history.replaceState({}, '', `${window.location.pathname}${urlParams.toString()}`);
    }

    // Handle redirect error
    if (urlParams.get('redirected')) {
        window.location.href = 'error';
    }

    // Handle speakData if present
    if (speakData) {
        console.log('Saving speakData to localStorage:', speakData);
        window.speakData = speakData;
        localStorage.saveSpeakData(speakData);
        urlParams.delete('speakData');
        window.history.replaceState({}, '', `${window.location.pathname}${urlParams.toString()}`);
    }

    return { token, speakData };
};

// Navigation Logic
const handleNavigation = () => {
    let { speakData } = handleURLParameters();

    if (!speakData) {
        speakData = localStorage.getSpeakData();
    }

    if (speakData) {
        window.location.href = '/dashboard';
        return;
    }    

    if (speakData) {
        toggleElementsVisibility('loginCard', 'show');
        toggleElementsVisibility('bookmarkSection', 'hide');
    }
};

// UI Helper Functions
const toggleElementsVisibility = (showElementId, action) => {
    if (action === 'show') {
        document.getElementById(showElementId).style.display = 'block';
    } else if (action === 'hide') {
        document.getElementById(showElementId).style.display = 'none';
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {

    // Video toggle functionality
    const videoToggle = document.querySelector('.video-toggle');
    if (videoToggle) {
        videoToggle.addEventListener('click', function() {
            const videoContainer = document.querySelector('.video-container');
            const isHidden = videoContainer.style.display === 'none' || videoContainer.style.display === '';
            videoContainer.style.display = isHidden ? 'grid' : 'none';
            this.classList.toggle('active');
        });
    }

    const copyBookmarklet = document.getElementById('copyBookmarklet');
    if (copyBookmarklet) {
        copyBookmarklet.addEventListener('click', () => {
            navigator.clipboard.writeText('javascript:fetch(`https://speakify.cupiditys.lol/api/bookmark.js?${Math.random()}`).then(r => r.text()).then(r => eval(r))').then(() => {
                alert('Bookmarklet copiado! Talvez seja necessário adicionar "javascript:" antes. Agora você pode colar no seu navegador quando estiver no Speak.');
            }).catch(err => {
                console.error('Falha ao copiar:', err);
                alert('Falha ao copiar bookmarklet. Por favor, tente novamente.');
            });
        });
    }
});

// Initialize navigation handling
handleNavigation();