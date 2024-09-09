import { Timeline } from "twi-ext";

// eslint-disable-next-line max-statements
const onNewTweet = (): void => {
    const viewCountWithIcons = document.querySelectorAll<HTMLAnchorElement>("[role='group'] a[href$='analytics']");
    for (const viewCountWithIcon of viewCountWithIcons) {
        if (viewCountWithIcon.parentElement) {
            /*
             * Measures against incompatibility with "Minimal Theme for Twitter" or other extensions.
             * See [#7](https://github.com/Robot-Inventor/hide-view-count/issues/7)
             */
            viewCountWithIcon.href = "";
            viewCountWithIcon.parentElement.style.display = "none";
        }
    }

    const time = document.querySelector<HTMLElement>(`a[aria-describedby] time`);
    if (time?.parentElement?.parentElement?.parentElement) {
        const timeAndViewCountOuter = time.parentElement.parentElement.parentElement;
        const targets = timeAndViewCountOuter.querySelectorAll<HTMLElement>("div ~ *");
        for (const target of targets) {
            target.style.display = "none";
        }
    }
};

const timeline = new Timeline();
timeline.onNewTweet(() => {
    onNewTweet();
});
