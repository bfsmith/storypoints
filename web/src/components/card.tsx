import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import Fa from 'solid-fa';

interface Props {
  points: number;
  isSelected: boolean;
  onSelect: () => void;
}

function CardComponent(props: Props) {
  return (
    <div
      class={`card w-24 ${
        props.isSelected ? "secondary" : "bg-base-100"
      } shadow-md border border-black cursor-pointer`}
      onClick={() => props.onSelect()}
    >
      <div class="card-body p-8 flex  flex-row items-center justify-center text-2xl">
        {props.points >= 0 ? (
          props.points
        ) : (
          <Fa class="inline" icon={faQuestion} />
        )}
      </div>
    </div>
  );
}

export default CardComponent;
