#pragma strict
private var totalEnemies : int = 0;
private var timeRemaining : float = 2*60;
function Start () {
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
}

function FormatSeconds(elapsed: float) : String {
    var d : int = parseInt(elapsed * 100.0f);
    var minutes : int = d / (60 * 100);
    var seconds : int = (d % (60 * 100)) / 100;
    var hundredths : int = d % 100;
    return String.Format("{0:00}:{1:00}.{2:00}", minutes, seconds, hundredths);
}
    
    
function Update () {
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
	var hudobj : GameObject = GameObject.Find("HudText");
	var hud = hudobj.GetComponent(GUIText);
	hud.text = String.Format("Time Remaining: " + FormatSeconds(timeRemaining));
	
	timeRemaining -= Time.deltaTime;
	if (timeRemaining < 30) {
		
	}
	if (Input.GetKeyUp(KeyCode.Escape)) {
		Application.Quit();
	}
	
}