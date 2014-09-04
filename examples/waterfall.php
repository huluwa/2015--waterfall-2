<?php
function gbk2utf8($data)
{
    if (is_array($data))
    {
        return array_map('gbk2utf8', $data);
    }
    else if (is_object($data))
    {
        return array_map('gbk2utf8', get_object_vars($data));
    }
    return mb_convert_encoding($data, 'UTF-8', 'GBK');
}

class Response
{
    // CONTENT TYPE
    const JSON = 'application/json';
    const HTML = 'text/html';
    const JAVASCRIPT = 'text/javascript';
    const JS   = 'text/javascript';
    const TEXT = 'text/plain';
    const XML  = 'text/xml';

    static public $response_type = null;

    static public function JSON($code, $data = array(), $content_type = Response::JSON)
    {
        self::$response_type = Response::JSON;

		if($content_type!==null){
			header("Content-type: " . $content_type);
		}

        if (is_object($data))
            $data = get_object_vars($data);
        else if (! is_array($data))
            $data = array();

        $data['retCode'] = $code;
        return htmlspecialchars(json_encode(gbk2utf8($data)), ENT_NOQUOTES);
    }

    static public function HTML($code, $data = array(), $content_type = Response::JSON)
    {
        self::$response_type = Response::HTML;

        header("Content-type: " . $content_type);

        if (is_object($data))
            $data = get_object_vars($data);
        else if (! is_array($data))
            $data = array();

        $data['retCode'] = $code;
        return json_encode(gbk2utf8($data));
    }
}

$result = array();
$AJ_RET_SUCC=1096;
$result['state'] = "sucess";
$result['items'] = array(
  	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:350px\">1</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:310px\">2</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:250px\">3</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:325px\">4</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:278px\">5</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:400px\">6</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:199px\">7</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:250px\">8</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:356px\">9</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:279px\">10</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:321px\">11</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:268px\">12</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:410px\">13</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:280px\">14</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:300px\">15</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:260px\">16</div></div></li>",
	"<li class=\"item\"><div class=\"wjh-item\"><div style=\"height:309px\">17</div></div></li>"
);
$result['pagenav'] = "";
sleep(1);
echo Response::HTML($AJ_RET_SUCC, $result);

?>