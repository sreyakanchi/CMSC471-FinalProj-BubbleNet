# CMSC471-FinalProj-BubbleNet
### Exploring Political Echo Chambers on Twitter (X) 

A visualiation of retweet networks across 11 topics drawn from a study of 150 million tweets. Each node is a Twitter user, colored on a continuous spectrum from blue (very liberal) to red (very conservative) based on estimated ideology scores. Edges connect users who retweeted another's tweet. 

Select any topic using the buttons above the graph to view any patterns arising depending on the discussion, whether political or non-political. 

The project can be viewed here: https://sreyakanchi.github.io/CMSC471-FinalProj-BubbleNet/
<br><br>

## Dataset

The visualization uses the replication archive from Barbera et al. (2015), "Tweeting from Left to Right: Is Online Political Communication More Than an Echo Chamber?" (Psychological Science), publicly available on Harvard Dataverse at dx.doi.org/10.7910/DVN/F9ICHH.
<br><br>

## Team Members & Contributions

**Srinidhi Arumugam**  
I set up the initial project structure and implemented the force-directed graph, including creating node and edge network layout. I worked on adjusting the node scaling based on connectivity to improve the visual representation of the data. I also implemented the ideological distribution bar chart for each topic, which shows the breakdown of user ideology within the Twitter users we sampled.

**Sreya Kanchi**  
...

**Sarah King**  
I wrote + formatted the information on the webpage, including the initial description, background, data selection, and sources section. I read the article our visualization was based on and summarized it in the background section as well as found sources that clearly defined what an echo chamber is.  I also worked on the tooltips for each node in the visualization, displaying the ideology label + score.

**Yooeun Lee**  
I set up the data pipeline, working with pre-processed outputs from the authors' research archive. This meant loading and exporting ideology scores from the authors' R data files, writing a python program to convert 11 per-topic retweet edge CSVs into a single `data.json` for D3 (1,000 edges per topic). I also worked on the front-end, building the controls area — a two-row button system organized by topic type — and the status bar showing the current topic name and category badge.


**Donovan Lee**  
I set up a coloring system for the data, creating a three point gradient to represent a node's ideology, from red for most conservative to gray for moderate to blue for most liberal. I created a small legend in the corner for these colors and ideologies. I also made the sizing system for the nodes, which uses d3.scaleSqrt to adjust the size of nodes based on their number of connected edges. 
<br><br>

## Sources

- https://github.com/pablobarbera/echo_chambers
- https://connorjerzak.com/wp-content/uploads/2016/08/Psychological-Science-2015-Barbera%CC%81-1531-42.pdf
- https://doi.org/10.1073/pnas.2023301118
- https://doi.org/10.1038/srep37825
  
