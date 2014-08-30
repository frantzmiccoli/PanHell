#pragma strict

var cursorTexture : Texture2D;
var cursorMode : CursorMode = CursorMode.Auto;
var hotSpot : Vector2 = Vector2(175, 175);

function Start () {
	
}

function Update () {

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
    if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), rayHit))
    {
  
    	Instantiate (objBall, rayHit.point, Quaternion.identity);
     
    }
    }
    }
     
    // ----

