import TrackList from "../TrackList/TrackList";
import "./SearchResults.css";

export default function SearchResults({ tracks, onAdd }) {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList tracks={tracks} onAdd={onAdd} isRemoval={false} />
    </div>
  );
}
