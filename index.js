const checked_tweets_class = "checked-by-hide-view-count";

const is_view_count_link = (element) => {
    return element.getAttribute("href").endsWith("analytics");
};

// Hide view count for normal timeline view.
const hide_view_count = () => {
    const tweets = document.body.querySelectorAll(`[data-testid="tweet"]:not(${checked_tweets_class})`);
    tweets.forEach((tweet) => {
        tweet.classList.add(checked_tweets_class);

        const link_list = [...tweet.querySelectorAll("a[role='link']")];
        const impression_icon = link_list.filter((e) => is_view_count_link(e));
        if (!impression_icon.length) return;

        // Measures against incompatibility with "Minimal Theme for Twitter" or other extensions. See [#7](https://github.com/Robot-Inventor/hide-view-count/issues/7)
        impression_icon[0].href = "";
        const impression_icon_outer = impression_icon[0].parentElement;
        impression_icon_outer.style.display = "none";
    });
};

// Hide view count for detailed view (reply browsing mode).
const hide_view_count_in_detailed_view = () => {
    const time_and_view_count_outer = document.querySelector('[data-testid="cellInnerDiv"] [data-testid="tweet"] time').parentElement.parentElement;
    // View Count and middle dot
    const target = time_and_view_count_outer.querySelectorAll('a[role="link"] ~ *');
    target.forEach((element) => {
        element.style.display = "none";
    });
};

// Wait for timeline to load.
const body_observer = new MutationObserver(() => {
    // Outer of the timeline.
    const timeline = document.querySelector("main");
    // Outer of the elements used for image view mode (images are displayed on the left and tweets on the right).
    const layer = document.querySelector("#layers");

    if (!(timeline && layer)) return;

    body_observer.disconnect();

    // Start timeline observing.
    const main_observer = new MutationObserver(() => {
        hide_view_count();
        hide_view_count_in_detailed_view();
    });
    main_observer.observe(timeline, {
        childList: true,
        subtree: true
    });

    // Start to observe elements used for image view mode.
    const layer_observer = new MutationObserver(() => {
        hide_view_count();
        hide_view_count_in_detailed_view();
    });
    layer_observer.observe(layer, {
        childList: true,
        subtree: true
    });
});

body_observer.observe(document.body, {
    childList: true,
    subtree: true
});
