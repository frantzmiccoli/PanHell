#pragma strict

var panPrefab: Transform;
private var _shooting = false;

function Start () {
	Debug.Log("Start");
}


function Update () {
	if (Input.GetAxis("Fire1")) {
		if (!_shooting) {
			_shooting = true;
			Instantiate(panPrefab, new Vector3(0,0,0), Quaternion.identity);
		}
		
	} else {
		_shooting = false;
	}
}