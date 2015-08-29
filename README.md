# memory_plainJavascript
Memory game built using just Javascript.

Click on the squares to flip them over. Matching pairs are removed. Game continues until all squares are matched.
Initial version was refactored into a MVC design. The view controls the UI (display changes, clicks, etc) and the game
object controls the game play (initialization, restart, matches and game progress). The Model is actually an array
within the game controller.
