#pragma strict
private var totalEnemies : int = 0;
function Start () {
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
}

function Update () {
	var enemies = GameObject.FindGameObjectsWithTag("Enemy");
	totalEnemies = enemies.length;
	var hudobj : GameObject = GameObject.Find("HudText");
	var hud = hudobj.GetComponent(GUIText);
	hud.text = "Total Enemies: "+totalEnemies;
	if (Input.GetKeyUp(KeyCode.Escape)) {
		Application.Quit();
	}
}