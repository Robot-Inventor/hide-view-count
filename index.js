const checked_tweets_class = "checked-by-hide-view-count";
const observer_option = {
    childList: true,
    subtree: true
};

class HideViewCount {
    constructor(target) {
        const observer = new MutationObserver(() => {
            this.timeline();
            this.detail_view();
        });
        observer.observe(target, observer_option);
    }

    // Hide view count for normal timeline view.
    timeline() {
        const links = document.body.querySelectorAll(`[data-testid="tweet"] a[aria-label][href$="analytics"]:not(.${checked_tweets_class})`);
        links.forEach((link) => {
            link.classList.add(checked_tweets_class);
            // Measures against incompatibility with "Minimal Theme for Twitter" or other extensions. See [#7](https://github.com/Robot-Inventor/hide-view-count/issues/7)
            link.href = "";
            const view_count_outer = link.parentElement;
            view_count_outer.style.display = "none";
        });
    }

    // Hide view count for detail view (reply browsing mode).
    detail_view() {
        const time = document.querySelector(`[data-testid="cellInnerDiv"] [data-testid="tweet"] time:not(.${checked_tweets_class})`);
        time.classList.add(checked_tweets_class);

        const time_and_view_count_outer = time.parentElement.parentElement;

        // View Count and middle dot
        const target = time_and_view_count_outer.querySelectorAll('a[role="link"] ~ *');
        target.forEach((element) => {
            element.style.display = "none";
        });
    }
}

// Wait for timeline to load.
const body_observer = new MutationObserver(() => {
    // Outer of the timeline.
    const timeline = document.querySelector("main");
    // Outer of the elements used for image view mode (images are displayed on the left and tweets on the right).
    const layer = document.querySelector("#layers");

    if (!(timeline && layer)) return;
    body_observer.disconnect();

    new HideViewCount(timeline);
    new HideViewCount(layer);
});
body_observer.observe(document.body, observer_option);
