# CMSC471-FinalProj-BubbleNet
### Exploring Political Echo Chambers on Twitter (X) 

The project can be viewed here: https://sreyakanchi.github.io/CMSC471-FinalProj-BubbleNet/

## Dataset

The visualization uses the replication archive from Barbera et al. (2015), "Tweeting from Left to Right: Is Online Political Communication More Than an Echo Chamber?" (Psychological Science), publicly available on Harvard Dataverse at dx.doi.org/10.7910/DVN/F9ICHH.


## Team Members & Contributions

**Srinidhi Arumugam** 
I set up the initial project structure and implemented the force-directed graph, including creating node and edge network layout. I worked on adjusting the node scaling based on connectivity to improve the visual representation of the data. I also implemented the ideological distribution bar chart for each topic, which shows the breakdown of user ideology within the Twitter users we sampled.

**Sreya Kanchi**
...

**Sarah King**
...

**Yooeun Lee**
I set up the data pipeline, working with pre-processed outputs from the authors' research archive. This meant loading and exporting ideology scores from the authors' R data files, writing a python program to convert 11 per-topic retweet edge CSVs into a single `data.json` for D3 (1,000 edges per topic). I also worked on the front-end, building the controls area — a two-row button system organized by topic type — and the status bar showing the current topic name and category badge.


**Donovan Lee**
...
