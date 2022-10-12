# VTS LiveDraw

Connect to VTubeStudio to draw on a specialized Artmesh grid using this pixel art software!

## Instructions

### Connecting
- Run vtsLiveDraw.exe
- Enter the port number configured in the VTubeStudio API settings, and click "Connect to VTubeStudio"
- Make sure a model with the special Artmesh grid is loaded
- Hit "Done"
- Press the "VTS" button in the top menu to return to the connection dialog if necessary
- If the "Auto-send to VTubeStudio" option is turned on, the Artmesh grid will be updated automatically when you draw
- If not, the "Send Image to VTubeStudio" button will send the current canvas state to VTubeStudio

### Custom Colors
To use colors besides the default, they should be added to the palette on the right using the Use Custom Color section. You can type a hex code for the color, or click the colored box to open a color picker. Make sure to hit the + button below it to add the color to the custom palette!

### Import and Export
The "Download" button at the top can be used to download a copy of the current image as a .pxlsh file. This file can be imported using the "New Project" button to restore it later.

You can also export a page showing any custom colors you've added, but there's currently no way to import those colors.

## Credit
Thanks to:
- denchi for [VTubeStudio](https://denchisoft.com/) and the [VTubeStudio API](https://github.com/DenchiSoft/VTubeStudio) that made this possible
- Alexander Yanovych for the original [PixelShape](https://github.com/Convicted202/PixelShape) drawing tool