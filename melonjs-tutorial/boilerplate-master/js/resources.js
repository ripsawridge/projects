game.resources = [

  /* Graphics. 
   * @example
   * {name: "example", type:"image", src: "data/img/example.png"},
   */
  // level tileset
  {name: "area01_level_tiles", type: "image", src: "data/img/map/area01_level_tiles.png" },
  // our metatiles
  {name: "metatiles32x32", type: "image", src: "data/img/map/metatiles32x32.png" },
  // our main player
  {name: "gripe_run_right", type: "image", src: "data/img/sprite/gripe_run_right.png" },
  // backgrounds
  {name: "area01_altbkg0", type: "image", src: "data/img/area01_altbkg0.png" },
  {name: "area01_altbkg1", type: "image", src: "data/img/area01_altbkg1.png" },

  {name: "area01_bkg0", type: "image", src: "data/img/area01_bkg0.png" },
  {name: "blackbox", type: "image", src: "data/img/blackbox.jpg" },

  // coin
  { name: "spinning_coin_gold", type: "image", src: "data/img/sprite/spinning_coin_gold.png" },
  // Baddie
  { name: "wheelie_right", type: "image", src: "data/img/sprite/wheelie_right.png" },

  // Font for heads up display
  { name: "32x32_font", type: "image", src: "data/img/font/32x32_font.png" },

  // menu screen
  { name: "title_screen", type: "image", src: "data/img/gui/title_screen.png" },

  /* Atlases 
   * @example
   * {name: "example_tps", type: "tps", src: "data/img/example_tps.json"},
   */
  
  /* Maps. 
   * @example
   * {name: "example01", type: "tmx", src: "data/map/example01.tmx"},
   * {name: "example01", type: "tmx", src: "data/map/example01.json"},
   */
  {name: "area01", type: "tmx", src: "data/map/area01.tmx"},
  {name: "area02", type: "tmx", src: "data/map/area02.tmx"},
  {name: "area03", type: "tmx", src: "data/map/area03.tmx"},

  /* Background music. 
   * @example
   * {name: "example_bgm", type: "audio", src: "data/bgm/"},
   */	
  {name: "dst-inertexponent", type: "audio", src: "data/bgm/"},

  /* Sound effects. 
   * @example
   * {name: "example_sfx", type: "audio", src: "data/sfx/"}
   */
  {name: "cling", type: "audio", src: "data/sfx/"},
  {name: "stomp", type: "audio", src: "data/sfx/"},
  {name: "die", type: "audio", src: "data/sfx/"},
  {name: "jump",  type: "audio", src: "data/sfx/"}
];
