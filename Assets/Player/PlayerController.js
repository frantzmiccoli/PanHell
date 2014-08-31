#pragma strict

var cursorTexture : Texture2D;
var cursorMode : CursorMode = CursorMode.Auto;
var hotSpot : Vector2 = Vector2(175, 175);
var laser : Transform;
private var isFiring : boolean = false;
private var laserOffsetFromGun : Vector3;
function Start () {
	laser = transform.Find("Main Camera/FirstPersonArm/Laser");
	isFiring = false;
	Screen.showCursor = false; 
	laserOffsetFromGun = laser.transform.localPosition;
}
function UpdateLaser() {
	//Debug.Log(laser);
	if (isFiring) {
		laser.active = true;
		var rayHit : RaycastHit;
    	var ray = Ray(Camera.main.transform.position,Camera.main.transform.forward);
    	if(Physics.Raycast(ray, rayHit)) {
    		var rayVec = rayHit.point - laser.transform.position;
    		laser.transform.localScale.z = rayVec.magnitude;
    		laser.transform.forward = Vector3.Normalize(rayVec);
    	}
		
	} else {
		laser.active = false;
	}
}
function Update () {
	UpdateLaser();
}

    // Click for Object name and position script
    // ----
     
    var rayHitWorldPosition : Vector3;
    var objectClickedName : String;
    var objectClickedPosition : Vector3;
    var objBall : Transform;
    
     
    // ----
     
function FixedUpdate()
{
    
    hotSpot = Vector2(cursorTexture.height/2,cursorTexture.width/2);
    
    Cursor.SetCursor(cursorTexture, hotSpot, cursorMode);

    // get player input
    if (Input.GetKeyDown(KeyCode.Mouse0))
    {
    	// raycast
    	var rayHit : RaycastHit;
    	var ray = Ray(Camera.main.transform.position,Camera.main.transform.forward);
    	if(Physics.Raycast(ray, rayHit))
    	{
  
    		Instantiate(objBall, rayHit.point, Quaternion.identity);
     
    	}
    } else {
    	isFiring = false;
    }
    
    if (Input.GetAxis("Fire1"))
    {
    	isFiring = true;
    } else {
    	isFiring = false;
    }
}
     
    // ----

