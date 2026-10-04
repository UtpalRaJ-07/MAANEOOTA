/**
 * The world behind the logo: a dark kitchen at meal time, warm lamplight on a
 * banana leaf, steam rising from food just below the frame.
 *
 *  - .mo-camera  dolly move shared by every world layer (parallax against the logo)
 *  - .mo-light   the lit room (pool of light on the leaf, warm air), blooming out of the dark
 *                (the overlay's own background is the darkness, so the opening frame is a
 *                single solid fill and costs nothing to paint)
 *  - .mo-atmos   WebGL leaf surface, volumetric steam and motes (progressive enhancement)
 *  - .mo-wisps   CSS steam used when WebGL is unavailable, too slow or not wanted (lite)
 *  - .mo-beam    a soft light travelling across the frame
 *  - .mo-flood   the exit: warm light rises from the meal and fills the room...
 *  - .mo-dawn    ...until the frame is the website's own warm white
 */
export function CinematicScene() {
  return (
    <div className="mo-scene">
      <div className="mo-camera">
        <div className="mo-light" />
        <canvas className="mo-atmos" />
        <div className="mo-wisps">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="mo-beam" />
      <div className="mo-flood" />
      <div className="mo-dawn" />
    </div>
  );
}
