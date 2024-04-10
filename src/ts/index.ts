import { Timeline, Tweet } from "twi-ext";

const onNewTweet = (tweet: Tweet): void => {
    const tweetElement = tweet.element;
    const viewCountWithIcon = tweetElement.querySelector<HTMLAnchorElement>("[role='group'] a[href$='analytics']");
    if (viewCountWithIcon && viewCountWithIcon.parentElement) {
        // Measures against incompatibility with "Minimal Theme for Twitter" or other extensions. See [#7](https://github.com/Robot-Inventor/hide-view-count/issues/7)
        viewCountWithIcon.href = "";
        viewCountWithIcon.parentElement.style.display = "none";
    }

    const viewCountTextOnly = tweetElement.querySelectorAll<HTMLElement>(
        "div[aria-hidden='true'], div[aria-hidden='true'] + div"
    );
    for (const element of viewCountTextOnly) {
        element.style.display = "none";
    }
};

const timeline = new Timeline();
timeline.onNewTweet((tweet) => {
    onNewTweet(tweet);
});
