let hits = 3;

basic.forever(() => {
  basic.showNumber(hits);
});

input.onButtonPressed(Button.A, () => {
  hits++;
});

input.onButtonPressed(Button.B, () => {
  if (hits > 3) {
    hits--;
  }
});

input.onButtonPressed(Button.AB, () => {
  basic.showString("FinalHeaven!");
  hits = 3;
});

