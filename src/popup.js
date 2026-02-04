console.log(document.getElementById('clickBtn'));
import CryptoJS from 'crypto-js';

const llgIv = 'yZM2mn0akhcq4VQK';
const llgSecret = 'KEYTphIWNO1D9LfMsHoi0by3AZcR5tvu';

function llgEncrypt(str) {
  const result = CryptoJS.AES.encrypt(str, CryptoJS.enc.Utf8.parse(llgSecret), {
    iv: CryptoJS.enc.Utf8.parse(llgIv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return result + '';
}

function llgDecrypt(str) {
  if (str === null) return '';
  return CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(llgSecret), {
    iv: CryptoJS.enc.Utf8.parse(llgIv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
}

const ytSecret = CryptoJS.enc.Base64.parse(
  'BY6FRfeRiaFlMWFb6ozu3FIIp0m6sR/ay/5+075xkFY='
);

function ytEncrypt(data) {
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const ivString = iv.toString(CryptoJS.enc.Base64);
  const value = CryptoJS.AES.encrypt(data, ytSecret, {
    iv
  }).toString();
  const mac = CryptoJS.HmacSHA256(
    `${ivString}${value}`,
    ytSecret
  ).toString();

  return btoa(JSON.stringify({
    iv: ivString,
    mac,
    value,
    tag: ''
  }));
}

function ytDecrypt(str) {
  const encrypted = JSON.parse(atob(str));

  return CryptoJS.AES.decrypt(encrypted.value, ytSecret, {
    iv: CryptoJS.enc.Base64.parse(encrypted.iv)
  }).toString(CryptoJS.enc.Utf8);
}

const xmjzsecret = CryptoJS.enc.Base64.parse(
    'BY6FRfeRiaFlMWFb6ozu3FIIp0m6sR/ay/5+075xkFY='
);

const xmjzApiSecret = CryptoJS.enc.Base64.parse(
    'vRnB4TvdM/Gfc5zS1hC8NFrBZI8RGfW43Q7ZaD9dBak='
);

function xmjzEncrypt(data, isApi = false) {
  let encryptSecret = xmjzsecret;
  if (isApi) {
    encryptSecret = xmjzApiSecret;
  }
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const ivString = iv.toString(CryptoJS.enc.Base64);
  const value = CryptoJS.AES.encrypt(data, encryptSecret, {
    iv
  }).toString();
  const mac = CryptoJS.HmacSHA256(
      `${ivString}${value}`,
      encryptSecret
  ).toString();

  return btoa(
      JSON.stringify({
        iv: ivString,
        mac,
        value,
        tag: ''
      })
  );
}

function xmjzDecrypt(str, isApi = false) {
  let encryptSecret = xmjzsecret;
  if (isApi) {
    encryptSecret = xmjzApiSecret;
  }
  const encrypted = JSON.parse(atob(str));

 return  CryptoJS.AES.decrypt(encrypted.value, encryptSecret, {
    iv: CryptoJS.enc.Base64.parse(encrypted.iv)
  }).toString(CryptoJS.enc.Utf8);
}

const cpaApiSecret = 'b6e907d979c7d3ea2e0531165264d9cc'

function CPAEncrypt(str) {
  const result = CryptoJS.AES.encrypt(str, CryptoJS.enc.Utf8.parse(cpaApiSecret), {
    iv: CryptoJS.enc.Utf8.parse(''),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return result + '';
}

function CPADecrypt(str) {
  if (str === null) return '';
  const reg = /"([A-Za-z0-9+/]+={0,2})"/g;
  const match = str.toString().match(reg);
  const decryptStr = match && match[0] ? match[0] : str;
  const finallyStr = decryptStr?.replace('"', '');
  return CryptoJS.AES.decrypt(finallyStr, CryptoJS.enc.Utf8.parse(cpaApiSecret), {
    iv: CryptoJS.enc.Utf8.parse(''),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
}

// JSON Viewer 功能
class JSONViewer {
  constructor(container) {
    this.container = container;
    this.jsonData = null;
    this.isExpanded = false;
  }

  // 渲染JSON数据
  render(jsonString) {
    try {
      this.jsonData = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      this.container.innerHTML = '';
      
      // 添加工具栏
      this.addToolbar();
      
      // 渲染JSON树
      const treeContainer = document.createElement('div');
      treeContainer.className = 'json-tree';
      this.container.appendChild(treeContainer);
      
      this.renderNode(this.jsonData, treeContainer, 'root');
      
      // 默认展开所有节点
      this.expandAll();
      
    } catch (error) {
      this.container.innerHTML = `<div class="json-error">无效的JSON格式: ${error.message}</div>`;
    }
  }

  // 添加工具栏
  addToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'json-toolbar';
    
    const expandBtn = document.createElement('button');
    expandBtn.className = 'toolbar-btn';
    expandBtn.innerHTML = '🔽 展开全部';
    expandBtn.onclick = () => this.expandAll();
    
    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'toolbar-btn';
    collapseBtn.innerHTML = '🔼 折叠全部';
    collapseBtn.onclick = () => this.collapseAll();
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'toolbar-btn';
    copyBtn.innerHTML = '📋 复制JSON';
    copyBtn.onclick = () => this.copyJSON();
    
    const rawBtn = document.createElement('button');
    rawBtn.className = 'toolbar-btn';
    rawBtn.innerHTML = '📄 原始文本';
    rawBtn.onclick = () => this.showRawText();
    
    toolbar.appendChild(expandBtn);
    toolbar.appendChild(collapseBtn);
    toolbar.appendChild(copyBtn);
    toolbar.appendChild(rawBtn);
    
    this.container.appendChild(toolbar);
  }

  // 渲染JSON节点
  renderNode(data, container, key, path = '') {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'json-node';
    
    if (data === null) {
      nodeDiv.innerHTML = `<span class="json-key">${key}:</span> <span class="json-null">null</span>`;
    } else if (typeof data === 'boolean') {
      nodeDiv.innerHTML = `<span class="json-key">${key}:</span> <span class="json-boolean">${data}</span>`;
    } else if (typeof data === 'number') {
      nodeDiv.innerHTML = `<span class="json-key">${key}:</span> <span class="json-number">${data}</span>`;
    } else if (typeof data === 'string') {
      nodeDiv.innerHTML = `<span class="json-key">${key}:</span> <span class="json-string">"${this.escapeHtml(data)}"</span>`;
    } else if (Array.isArray(data)) {
      const arrayHeader = document.createElement('div');
      arrayHeader.className = 'json-array-header';
      arrayHeader.innerHTML = `<span class="json-toggle" data-path="${path}">▶</span> <span class="json-key">${key}:</span> <span class="json-bracket">[</span><span class="json-count">${data.length} items</span><span class="json-bracket">]</span>`;
      
      const arrayContent = document.createElement('div');
      arrayContent.className = 'json-array-content';
      arrayContent.style.display = 'none';
      
      data.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'json-array-item';
        itemDiv.innerHTML = `<span class="json-index">[${index}]</span>`;
        this.renderNode(item, itemDiv, '', `${path}[${index}]`);
        arrayContent.appendChild(itemDiv);
      });
      
      nodeDiv.appendChild(arrayHeader);
      nodeDiv.appendChild(arrayContent);
      
      // 添加点击事件
      arrayHeader.querySelector('.json-toggle').onclick = (e) => {
        const toggle = e.target;
        const content = arrayContent;
        if (content.style.display === 'none') {
          content.style.display = 'block';
          toggle.textContent = '▼';
        } else {
          content.style.display = 'none';
          toggle.textContent = '▶';
        }
      };
      
    } else if (typeof data === 'object') {
      const objectHeader = document.createElement('div');
      objectHeader.className = 'json-object-header';
      const keys = Object.keys(data);
      objectHeader.innerHTML = `<span class="json-toggle" data-path="${path}">▶</span> <span class="json-key">${key}:</span> <span class="json-brace">{</span><span class="json-count">${keys.length} properties</span><span class="json-brace">}</span>`;
      
      const objectContent = document.createElement('div');
      objectContent.className = 'json-object-content';
      objectContent.style.display = 'none';
      
      keys.forEach(propKey => {
        const propDiv = document.createElement('div');
        propDiv.className = 'json-property';
        this.renderNode(data[propKey], propDiv, propKey, path ? `${path}.${propKey}` : propKey);
        objectContent.appendChild(propDiv);
      });
      
      nodeDiv.appendChild(objectHeader);
      nodeDiv.appendChild(objectContent);
      
      // 添加点击事件
      objectHeader.querySelector('.json-toggle').onclick = (e) => {
        const toggle = e.target;
        const content = objectContent;
        if (content.style.display === 'none') {
          content.style.display = 'block';
          toggle.textContent = '▼';
        } else {
          content.style.display = 'none';
          toggle.textContent = '▶';
        }
      };
    }
    
    container.appendChild(nodeDiv);
  }

  // 展开所有节点
  expandAll() {
    const toggles = this.container.querySelectorAll('.json-toggle');
    toggles.forEach(toggle => {
      const content = toggle.parentElement.nextElementSibling;
      if (content && content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '▼';
      }
    });
  }

  // 折叠所有节点
  collapseAll() {
    const toggles = this.container.querySelectorAll('.json-toggle');
    toggles.forEach(toggle => {
      const content = toggle.parentElement.nextElementSibling;
      if (content) {
        content.style.display = 'none';
        toggle.textContent = '▶';
      }
    });
  }

  // 复制JSON
  copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(this.jsonData, null, 2));
    this.showToast('JSON已复制到剪贴板');
  }

  // 显示原始文本
  showRawText() {
    const rawText = JSON.stringify(this.jsonData, null, 2);
    this.container.innerHTML = `<div class="json-raw"><pre>${this.escapeHtml(rawText)}</pre></div>`;
  }

  // 显示提示
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'json-toast';
    toast.textContent = message;
    this.container.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  // HTML转义
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

let currentTab;
let jsonViewer;

// 初始化JSON Viewer
document.addEventListener('DOMContentLoaded', () => {
  const outputContainer = document.getElementById('outputText');
  const jsonViewerContainer = document.createElement('div');
  jsonViewerContainer.id = 'jsonViewerContainer';
  jsonViewerContainer.style.display = 'none';
  outputContainer.parentNode.appendChild(jsonViewerContainer);
  
  jsonViewer = new JSONViewer(jsonViewerContainer);
});

// 显示JSON Viewer或原始文本
function showOutput(content, isJSON = false) {
  const outputText = document.getElementById('outputText');
  const jsonViewerContainer = document.getElementById('jsonViewerContainer');
  
  if (isJSON && jsonViewer) {
    try {
      JSON.parse(content);
      outputText.style.display = 'none';
      jsonViewerContainer.style.display = 'block';
      jsonViewer.render(content);
    } catch (e) {
      // 如果不是有效JSON，显示原始文本
      outputText.style.display = 'block';
      jsonViewerContainer.style.display = 'none';
      outputText.textContent = content;
    }
  } else {
    outputText.style.display = 'block';
    jsonViewerContainer.style.display = 'none';
    outputText.textContent = content;
  }
}

document.getElementById('llgEncrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = llgEncrypt(JSON.stringify(element.value));
  showOutput(result, false);
});

document.getElementById('llgDecrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = llgDecrypt(element.value);
  showOutput(result, true);
});

document.getElementById('ytEncrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = ytEncrypt(JSON.stringify(element.value));
  showOutput(result, false);
});

document.getElementById('ytDecrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = ytDecrypt(element.value);
  showOutput(result, true);
});

document.getElementById('xmjzEncrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = xmjzEncrypt(JSON.stringify(element.value), true);
  showOutput(result, false);
});

document.getElementById('xmjzDecrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = xmjzDecrypt(element.value, true);
  showOutput(result, true);
});


document.getElementById('CPAEncrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const result = CPAEncrypt(JSON.stringify(element.value));
  showOutput(result, false);
});

document.getElementById('CPADecrypt').addEventListener('click', async function () {
  const element = document.getElementById('inputText');
  const value = element.value.trim().replace(/\\/g, "");
  const result = CPADecrypt(value);
  showOutput(result, true);
});



document.getElementById('json').addEventListener('click',  function () {
  const outputText = document.getElementById('outputText');
  const jsonViewerContainer = document.getElementById('jsonViewerContainer');
  
  let content = '';
  if (jsonViewerContainer.style.display !== 'none') {
    // 如果JSON Viewer正在显示，获取原始数据
    content = jsonViewer.jsonData ? JSON.stringify(jsonViewer.jsonData) : '';
  } else {
    content = outputText.textContent;
  }
  
  navigator.clipboard.writeText(content);
  window.alert('复制成功');
  window.open('https://www.json.cn/', 'blank');
});

// 接收消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const {action, payload} = request;
  console.log(request, 'popup got');
  sendResponse('popup got!');
});

// 接收 storage 中的数据
chrome.storage.sync.get({namespaced: 'aaa'}, (data) => {
  console.log(data, 'namespaced from background js');
});

// popup 通过 chrome.tabs.sendMessage 发送消息，
// content接收到content的消息后，通过 sendResponse将 greeting 数据发送出去
(async () => {
  // 查询当前tab
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
    currentWindow: true
  });
  currentTab = tab;
  // 和当前tab进行通信， 可以接收到content.js文件第31行的返回数据
  // const response = await chrome.tabs.sendMessage(tab.id, {
  //   greeting: 'hello',
  // });
  // do something with response here, not outside the function
  // console.log(response, "popup response");
})();

