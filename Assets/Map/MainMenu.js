#pragma strict

function Start () {

}

function Update () {

}

function OnGUI () {
    // Make a background box
	
	var menu_width = 200;
	var menu_height = 0;
	var button_height = 70;
	var button_width = 180;
	
    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button(Rect(Screen.width/2 - menu_width/2,Screen.height/2 - menu_height/2, button_width, button_height), "Start Game")) {
        Application.LoadLevel("map01");
    }

    // Make the second button.
    if (GUI.Button(Rect(Screen.width/2 - menu_width/2,Screen.height/2 - menu_height/2 + button_height + 30,button_width,button_height), "Quit")) {
        Application.Quit();
    }
}
