# Thought Process & Approach

This document outlines my approach to tackling this coding challenge. It covers the initial research, goal setting, key decisions, and reflections made throughout the process. My aim is to provide transparency into how I work and problem-solve, offering insight into both my technical methods and my perspective as a developer.

## Initial Research & Context Gathering

Before diving into the code, I gathered broader context about Vizzuality and its development practices:

- **GitHub Exploration:** I reviewed the [Vizzuality GitHub Organization](https://github.com/Vizzuality) to understand common technologies, project structures, and contribution patterns.
- **Discovering Resources:** This exploration led me to useful internal documentation and resources, including:
  - The [Front-end Scaffold Docs](https://front-end-scaffold-docs.vercel.app/)
  - Insights from [Devismos](https://vizzuality.github.io/devismos/docs/frontismos/strategy-2021/initiatives-directory/hiring-proposal/) regarding development strategy.
  - The detailed [Frontend Engineer Role Description (Google Doc)](https://docs.google.com/document/d/1uVeHYs6wOqRqQriZE7Y68JCNycXokVJX3K9y7d5t8mQ/edit?tab=t.0#heading=h.ql8npoan2zxg), which provided valuable specifics.

The text from above was generated based on my findings about the company, my whole idea was to have some organized log but for the moment I will add all my observations and maybe after finishing the challenge I will organize them better.

---

## Working Journal

- All features are developed into separate branches with specific naming and so.
- Initial problems occured because I wanted to have the Map component in the common layout of both `/networks` and `/networks/[network_id]` pages to have smooth animations of zoom in and out but after implementing I realized that due to the way Maps work, the animation wont be as good since the loading of tiles/vectors will make the animation look bad, good thing I didn't spend too much time on it.
- What I need to do when free time allows - pagination
- I need to find a better Figma plugin for the color palette, the fig2tw I used is not working.
- Had to downgrade from React 19 -> 18 because of some peer dependencies.
- This was bothering me a lot since the begining, normaly, i would use Next 14 and React 18 but I wanted to see what the new ones have to offer, risky decision since not as much resources ( StackOvf, LLMs etc.) but I quickly changed back because I dont have the luxury to experiment now.

Detail View :
hover on item
tooltip
pagination --> modify buttons as design
check navigation lag
animation on page swich

- [x] sticky header

I was experiencing extreme long loading time between page navigation, so downgrade to Next 14 ...


Regarding pagination and search on the server, it seems like the Api doesnt support that
https://github.com/eskerda/citybikes-api/blob/master/api/views.py

62.9 kb -> 45.1 kb