#pragma strict
var player: Transform;

private var totalEnemies : int = 0;
private var timeRemaining : float = 3.0*60;
private var bgm : AudioSource;
private var scoreTxt : GUIText;
private var gameOver : boolean = false;
function Start () {
	Debug.Log("Game Start!");
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
	bgm = Camera.main.GetComponent(AudioSource);
	scoreTxt = GameObject.Find("Score").GetComponent(GUIText);
	scoreTxt.active = false;
}

function FormatSeconds(elapsed: float) : String {
    var d : int = parseInt(elapsed * 100.0f);
    var minutes : int = d / (60 * 100);
    var seconds : int = (d % (60 * 100)) / 100;
    var hundredths : int = d % 100;
    return String.Format("{0:00}:{1:00}.{2:00}", minutes, seconds, hundredths);
}
function ShowWinScreen() {
	
	Time.timeScale = 0;
	scoreTxt.text = "You Won!\nTime: "+FormatSeconds(timeRemaining);
	scoreTxt.active = true;
	bgm.Stop();
	gameOver= true;
	
}

function ShowMenu() {
	var menu_width = 200;
	var menu_height = 0;
	var button_height = 70;
	var button_width = 180;
	Screen.showCursor = true;
	var pc: CharacterController = player.GetComponent(CharacterController);
    if (GUI.Button(Rect(Screen.width/2 - menu_width/2,Screen.height/2 - menu_height/2, button_width, button_height), "Retry")) {
    	Time.timeScale = 1.0;
    	if (gameOver) {
    		gameOver = false;
        	Application.LoadLevel(Application.loadedLevel);
        }
    }
    if (GUI.Button(Rect(Screen.width/2 - menu_width/2,Screen.height/2 - menu_height/2 + button_height + 30,button_width,button_height), "Quit")) {
    	Time.timeScale = 1.0;
        Application.Quit();
    }
}
function ShowLoseScreen() {
	var pc: CharacterController = player.GetComponent(CharacterController);
	Time.timeScale = 0;
	scoreTxt.text = "You Lose.\n"+totalEnemies+" enemies still remaining...";
	scoreTxt.active = true;
	bgm.Stop();
	gameOver = true;
}
function OnGUI() {
	if (gameOver) {
		ShowMenu();
	}
} 
function Update () {
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
	var hudobj : GameObject = GameObject.Find("HudText");
	var hud = hudobj.GetComponent(GUIText);
	hud.text = String.Format("Time Remaining: " + FormatSeconds(timeRemaining));
	if (timeRemaining >= 0) {
	timeRemaining -= Time.deltaTime;
	} else {
		timeRemaining = 0;
	}
	
	if (timeRemaining < 60) {
		
		bgm.audio.pitch = 1.1;
	}
	if (timeRemaining < 30) {
		
		bgm.audio.pitch = 1.25;
	}
	if (timeRemaining <= 0) {
		ShowLoseScreen();
	}
	if (Input.GetKeyUp(KeyCode.Escape)) {
		Application.Quit();
	}
	if (totalEnemies == 0) {
		ShowWinScreen();
	}
	
	
}