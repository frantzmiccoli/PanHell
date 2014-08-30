#pragma strict
var startHeight : float = 20.0;


private var _killTimer : float = 1;
private var _killMe : int = 0;
function Start () {
	transform.position.y = startHeight;
	transform.rotation.eulerAngles = Vector3(Random.Range(-30,30),Random.Range(0,360),Random.Range(-60,60));
	rigidbody.AddForce(0,-100,0);
}

function Update () {
	if (_killMe) {
		_killTimer -= Time.deltaTime;
		if (_killTimer <= 0) {
			Destroy(gameObject);
		}
	}
}

function OnCollisionEnter(col: Collision) {
	Debug.Log(col.gameObject.name);
	_killMe = 1;
	_killTimer = 1;
	
}
