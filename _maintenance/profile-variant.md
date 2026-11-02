# Alternate personal homepage

- Main: https://hf618.github.io/
- Alternate: https://hf618.github.io/profile.html

GitHub Pages' existing Jekyll build renders `profile.html` from `index.html` using `include_relative`. Both pages use the same styles, publication script, images, and videos. Keep editing `index.html` for shared content.

The alternate changes only the Industrial Experience section:
1. Removes the Zhipu AI entry.
2. Displays the BAAI entry as XYZ Embodied AI (星源智), with the official company link and logo. Dates and topic stay unchanged.

The applicant authorized the alternate attribution on 2026-11-02. Company English name/link/logo were checked against https://xyz-eai.com/en/index.html and https://xyz-eai.com/static/picture/logo.svg on that date.

The logo is the official unmodified SVG; its white lettering is displayed on a dark background.

## Maintenance

The section opener and the captured Zhipu block in `profile.html` match the HTML structure in `index.html`. If that markup or the Zhipu entry changes, update the capture/selector together. Ordinary paper, project, photo, and biography updates sync automatically during the Pages build.

After a change, check that the built alternate has three experience entries (Tencent Hunyuan, Horizon Robotics, XYZ Embodied AI), retains the intended dates/topics, and otherwise matches the main page. The main source must keep its original experience entries. Do not add `.nojekyll`; this template relies on Jekyll.

No email, CV, recommendation letter, or school routing is changed by this website variant.
