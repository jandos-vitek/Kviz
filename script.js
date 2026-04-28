
let againBtn;
let form;
let otazky;
let correctedQuiz;

window.addEventListener('DOMContentLoaded', () => {
  fetch('./otazky.json')
    .then(response => response.json())
    .then(data => {
      againBtn = document.getElementById("again");
      form = document.getElementById("form");
      otazky = data.kviz;
      correctedQuiz = document.getElementById("correctedQuiz");
      renderQuestion(0)


      againBtn.addEventListener('click', () => {
        form.innerHTML = '';
        renderQuestion(0);
        againBtn.classList.toggle('active');
        document.getElementById('score').innerHTML = "";
        correctedQuiz.style.display='none';
          form.style.display = 'block';
      });
    });


});






function renderQuestion(index) {
  const otazka = otazky[index];
  const fieldset = el('fieldset');

  const title = el('h2');
  title.innerHTML = otazka.otazka;

  fieldset.appendChild(title);
  getOptions(otazka.moznosti, fieldset, index);

  let nextBtn;

  if (otazka.posledni) {
    nextBtn = el('button', { type: 'button', class: "nextBtn" }, 'Vyhodnotit');
    nextBtn.addEventListener('click', () => {
      correct();
      againBtn.classList.toggle('active');
    });
  }
  else {
    nextBtn = el('button', { type: 'button', class: "nextBtn" }, 'Další');
    nextBtn.addEventListener('click', () => {
      const fieldsety = form.querySelectorAll('fieldset');
      if (fieldsety[index + 1]) {
        fieldsety[index].style.display = 'none';
        fieldsety[index + 1].style.display = 'block';
      } else {
        fieldsety[index].style.display = 'none';
        renderQuestion(index + 1);
      }
    });
  }

  const previousBtn = el('button', { type: 'button', class: "nextBtn" }, 'Předchozí');
  previousBtn.addEventListener('click', () => {
    if (index - 1 >= 0) {
      const fieldsety = form.querySelectorAll('fieldset');
      fieldsety[index].style.display = 'none';
      fieldsety[index - 1].style.display = 'block';
    }
  });

  const btnWrapper = el('div', { class: 'btnWrapper' }, previousBtn, nextBtn);
  fieldset.appendChild(btnWrapper);

  form.appendChild(fieldset);
}


function correct() {
    correctedQuiz.style.display='block';
  let score = 0;
  for (let i = 0; i < otazky.length; i++) {
    const selected = document.querySelector(`input[name="otazka_${i}"]:checked`);
    question = otazky[i].otazka;
    const wrapper=el('div',{class: 'correctedQuestion'},question);


otazky[i].moznosti.forEach((moznost, j) => {
  const option = el('div', { class: 'correctedOption' }, moznost.moznost);

  if (moznost.spravne === true) {
    option.classList.add('correct');
  }

  if (selected&&selected.id === `otazka_${i}${j}`) {
    option.classList.add('selected');
    if(selected.value=== 'false'){
      option.classList.add('incorrect');
    }else{
      score++;
    }
  }

  wrapper.appendChild(option);
});
           correctedQuiz.appendChild(wrapper);

  }

  document.getElementById('score').innerHTML = `skóre: ${score}/${otazky.length}`;


  form.style.display = 'none';
}




function getOptions(moznosti, fieldset, index) {
  moznosti.forEach((moznost, i) => {
    const wrapper = el('div', { class: 'questionWrapper' });
    const id = `otazka_${index}${i}`;
    const radio = el('input', { type: 'radio', name: `otazka_${index}`, value: moznost.spravne, class: 'radio', id });
    const label = el('label', { class: 'questionLabel', for: id }, moznost.moznost);

    wrapper.appendChild(radio);
    wrapper.appendChild(label);
    fieldset.appendChild(wrapper);
  });
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  });
  children.forEach(c => {
    if (typeof c === 'string' || typeof c === 'number') {
      node.appendChild(document.createTextNode(String(c)));
    } else if (c instanceof Node) {
      node.appendChild(c);
    }
  });
  return node;
}