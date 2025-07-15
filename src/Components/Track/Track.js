import "./Track.css";

export default function Track({ isRemoval, track, onAdd, onRemove }) {
  function addTrack() {
    onAdd(track);
  }

  function removeTrack() {
    onRemove(track);
  }
  function renderAction() {
    return (
      <button
        className="Track-action"
        onClick={isRemoval ? removeTrack : addTrack}
      >
        {isRemoval ? "-" : "+"}
      </button>
    );
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>
          {track.artist} | {track.album}
        </p>
      </div>
      {renderAction()}
    </div>
  );
}
