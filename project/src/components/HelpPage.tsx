export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">
        Guia do Usuário – Sistema de Pedidos de Lanche Hennings
      </h2>
      <p className="mb-6 text-lg text-gray-700">
        Bem-vindo ao Sistema de Pedidos de Lanche Hennings!
        <br />
        Aqui você pode fazer seu pedido de forma rápida e prática, direto pelo
        celular ou computador, sem precisar gastar papel e caneta.
        <br />
        Este manual vai te mostrar passo a passo como usar o sistema.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2 text-blue-600">
        Como Fazer um Pedido
      </h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-800">
        <li>
          <b>1️⃣ Acesse o site</b>
          <ul className="list-disc pl-6">
            <li>
              Entre no link: <b>henningslanche.netlify.app</b>
            </li>
            <li>
              A página inicial vai abrir com o título “Hennings pedido de
              lanche”.
            </li>
          </ul>
        </li>
        <li>
          <b>2️⃣ Preencha seus dados</b>
          <ul className="list-disc pl-6">
            <li>
              Na seção <b>Novo Pedido</b>:
            </li>
            <li>Digite o Nome do Colaborador.</li>
            <li>Preencha o Setor do Pedido</li>
            <li>
              Se quiser, adicione observações (exemplo: “sem maionese” ou
              “entregar às 15h”).
            </li>
          </ul>
        </li>
        <li>
          <b>3️⃣ Escolha seus produtos</b>
          <ul className="list-disc pl-6">
            <li>
              Na seção <b>Catálogo de Produtos</b>:
            </li>
            <li>
              Use as abas <b>Todos | Comidas | Bebidas</b> para navegar.
            </li>
            <li>Para adicionar um item, clique no botão “+”.</li>
            <li>Se escolher errado, clique em “–” para remover.</li>
            <li>A quantidade aparece no meio.</li>
          </ul>
        </li>
        <li>
          <b>4️⃣ Confira o resumo</b>
          <ul className="list-disc pl-6">
            <li>
              Na seção <b>Resumo dos Pedidos</b>, você verá:
            </li>
            <li>O valor total do seu pedido.</li>
            <li>O limite permitido, que depende do dia:</li>
            <li>Segunda a sexta-feira → até R$ 15,00 por pessoa</li>
            <li>Sábado → até R$ 25,00 por pessoa</li>
            <li>💰 O troco acumulado (se houver).</li>
            <li>🥤 O sistema de coca automática:</li>
            <li>
              A cada R$ 13,00 de troco acumulado, o sistema gera 1 Coca-Cola
              para você.
            </li>
            <li>
              O valor que sobrar depois da Coca fica registrado como saldo.
            </li>
          </ul>
        </li>
        <li>
          <b>5️⃣ Finalize seu pedido</b>
          <ul className="list-disc pl-6">
            <li>Você terá 3 opções:</li>
            <li>
              📄 <b>Baixar PDF</b> → Gera um relatório do pedido.
            </li>
            <li>
              📧 <b>Enviar por E-mail</b> → Manda diretamente para o e-mail
              cadastrado.
            </li>
            <li>
              💬 <b>Finalizar no WhatsApp</b> → Abre o WhatsApp já com seu
              pedido formatado.
            </li>
          </ul>
          <div className="flex justify-center my-2">
            <img
              src="/img/img.02.jpeg"
              alt="Exemplo PDF"
              className="rounded border border-gray-200 shadow w-full max-w-full h-auto object-contain"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
          <div className="flex justify-center my-2">
            <img
              src="/img/img.01.jpeg"
              alt="Exemplo WhatsApp"
              className="rounded border border-gray-200 shadow w-full max-w-full h-auto object-contain"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
          <p className="mt-2 ml-6 text-gray-700">
            No WhatsApp, basta clicar em Enviar para confirmar, lá terá todas as
            informações
          </p>
        </li>
        <li>
          <b>6️⃣ Aguarde a confirmação</b>
          <ul className="list-disc pl-6">
            <li>
              Depois de enviar o pedido, aguarde a confirmação da equipe de
              lanches.
            </li>
            <li>
              Você receberá informações sobre tempo de preparo ou entrega.
            </li>
          </ul>
        </li>
      </ol>

      <h3 className="text-xl font-semibold mt-8 mb-2 text-blue-600">
        📝 Exemplo de Pedido
      </h3>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <p className="mb-1">
          🔹 <b>Pedido:</b> 2 mistos quentes (R$ 7,00 cada).
        </p>
        <p className="mb-1">
          Total do pedido: <b>R$ 14,00</b>.
        </p>
        <p className="mb-1">
          Como está dentro do limite de R$ 15,00 (dia de semana), o pedido é
          aceito.
        </p>
        <p className="mb-1">
          Troco acumulado: <b>R$ 1,00</b>.
        </p>
        <p className="mb-1">
          Como ainda não atingiu R$ 13, não gera Coca-Cola.
        </p>
        <p className="mb-1">
          🔹 Se em outro pedido o troco acumulado chegar a R$ 13,00 → o sistema
          automaticamente gera 1 Coca-Cola.
        </p>
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-2 text-blue-600">
        ⚡ Dicas Úteis
      </h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-800">
        <li>Confira sempre o limite do dia antes de finalizar.</li>
        <li>Use o campo de observações para detalhes do seu lanche.</li>
        <li>Se precisar cancelar, clique no ícone 🗑️ ao lado do seu pedido.</li>
        <li>O botão Limpar apaga todos os itens do pedido.</li>
        <li>
          O sistema calcula e mostra automaticamente quando você ganhou uma
          Coca-Cola.
        </li>
      </ul>

      <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800">
        Agora é só seguir esse guia e aproveitar seu lanche com praticidade! 😋
      </div>

      {/* Vídeo explicativo YouTube (modelo short) */}
      <div className="mt-10 flex flex-col items-center">
        <span className="mb-3 text-lg font-bold text-blue-700 uppercase tracking-wide">
          VEJA UM TUTORIAL RÁPIDO DE COMO USAR O SISTEMA
        </span>
        <div className="w-full flex justify-center">
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 360,
              aspectRatio: "9/16",
            }}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xs"
          >
            <iframe
              src="https://www.youtube.com/embed/RVNq2Y6vs_0"
              title="YouTube short player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full max-w-full rounded-xl border border-gray-200 shadow"
              style={{ aspectRatio: "9/16", minHeight: 320 }}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
