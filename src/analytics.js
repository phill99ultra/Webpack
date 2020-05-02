import * as $ from 'jquery';
const createAnalytics = () => {
    let counter = 0,
        destroy = false;
    const listner = () => counter++;
    $(document).on('click', listner);
    return {
        destroy() {
            $(document).of('click', listner);
            destroy = true;
        },
        getClicks() {
            if (destroy) {
                return `Analytics is destroyed. Total clicks = ${counter}`;
            }
            return counter;
        }
    };
};

window.analytics = createAnalytics();