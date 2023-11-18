interface Props {
  points: number;
  isSelected: boolean;
  onSelect: () => void;
}

function CardComponent({ onSelect, isSelected, points }: Props) {
  return (
    <div
      class={`card w-24 ${isSelected ? 'secondary' : 'bg-base-100'} shadow-md border border-black cursor-pointer`}
      onClick={() => onSelect()}
    >
      <div class="card-body p-8 flex  flex-row items-center justify-center text-2xl">
        {points}
      </div>
    </div>
  );
}

export default CardComponent;
