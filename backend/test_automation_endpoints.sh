#!/bin/bash

# 🧪 Script de Testing Automatizado para Endpoints de Automatización
# Sistema Gyros - Fase 5
# Fecha: Septiembre 2025

echo "🧪 INICIANDO TESTS AUTOMATIZADOS DEL SISTEMA GYROS"
echo "=================================================="

# Configuración
BASE_URL="http://localhost:3001/api"
TEST_EMAIL="test@automation.com"
TEST_PASSWORD="TestPass123!"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Función para logging
log_test() {
    local status=$1
    local test_name=$2
    local details=$3
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} - $test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAIL${NC} - $test_name"
        [ ! -z "$details" ] && echo -e "   ${RED}Detalles: $details${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Función para verificar respuesta HTTP
check_http_response() {
    local response=$1
    local expected_success=$2
    
    if echo "$response" | grep -q '"success":true' && [ "$expected_success" = "true" ]; then
        return 0
    elif echo "$response" | grep -q '"success":false' && [ "$expected_success" = "false" ]; then
        return 0
    else
        return 1
    fi
}

echo -e "${BLUE}📡 TEST 1: Verificar servidor base${NC}"
response=$(curl -s "$BASE_URL" || echo "ERROR")
if echo "$response" | grep -q "Hello World"; then
    log_test "PASS" "Servidor base respondiendo"
else
    log_test "FAIL" "Servidor base" "Respuesta: $response"
fi

echo -e "\n${BLUE}🔐 TEST 2: Autenticación${NC}"
auth_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" || echo "ERROR")

if echo "$auth_response" | grep -q '"token"'; then
    TOKEN=$(echo "$auth_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    log_test "PASS" "Login exitoso"
else
    log_test "FAIL" "Login" "Respuesta: $auth_response"
    echo -e "${RED}❌ No se puede continuar sin token de autenticación${NC}"
    exit 1
fi

echo -e "\n${BLUE}🤖 TEST 3: Endpoints de Automatización${NC}"

# Test 3.1: Check Device ID
response=$(curl -s -X GET "$BASE_URL/automation/check-device-id" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Check Device ID"
else
    log_test "FAIL" "Check Device ID" "Respuesta: $response"
fi

# Test 3.2: Status
response=$(curl -s -X GET "$BASE_URL/automation/status" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Status del sistema"
else
    log_test "FAIL" "Status del sistema" "Respuesta: $response"
fi

# Test 3.3: History
response=$(curl -s -X GET "$BASE_URL/automation/history" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if echo "$response" | grep -q '\['; then
    log_test "PASS" "Historial de procesos"
else
    log_test "FAIL" "Historial de procesos" "Respuesta: $response"
fi

echo -e "\n${BLUE}📊 TEST 4: Endpoints de Estadísticas (Fase 5)${NC}"

# Test 4.1: Health Check
response=$(curl -s -X GET "$BASE_URL/automation/health" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Health Check"
else
    log_test "FAIL" "Health Check" "Respuesta: $response"
fi

# Test 4.2: Estadísticas Diarias
response=$(curl -s -X GET "$BASE_URL/automation/stats/daily" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true" && echo "$response" | grep -q '"date"'; then
    log_test "PASS" "Estadísticas diarias"
else
    log_test "FAIL" "Estadísticas diarias" "Respuesta: $response"
fi

# Test 4.3: Estadísticas de Dispositivos
response=$(curl -s -X GET "$BASE_URL/automation/stats/devices" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true" && echo "$response" | grep -q '"totalDevices"'; then
    log_test "PASS" "Estadísticas de dispositivos"
else
    log_test "FAIL" "Estadísticas de dispositivos" "Respuesta: $response"
fi

# Test 4.4: Estadísticas de Rendimiento
response=$(curl -s -X GET "$BASE_URL/automation/stats/performance" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true" && echo "$response" | grep -q '"successRate"'; then
    log_test "PASS" "Estadísticas de rendimiento"
else
    log_test "FAIL" "Estadísticas de rendimiento" "Respuesta: $response"
fi

echo -e "\n${BLUE}🔧 TEST 5: Proceso de Automatización Completo${NC}"

# Test 5.1: Start Process con toggle_prestamo_status
response=$(curl -s -X POST "$BASE_URL/automation/start-process" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"action":"toggle_prestamo_status","newStatus":true,"notes":"Test automatizado"}' || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Proceso completo - Toggle préstamo"
else
    log_test "FAIL" "Proceso completo - Toggle préstamo" "Respuesta: $response"
fi

# Test 5.2: Start Process con execute_robot_action
response=$(curl -s -X POST "$BASE_URL/automation/start-process" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"action":"execute_robot_action","notes":"Test automatizado Robot"}' || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Proceso completo - Robot action"
else
    log_test "FAIL" "Proceso completo - Robot action" "Respuesta: $response"
fi

echo -e "\n${BLUE}🐍 TEST 6: Scripts Python/Robot${NC}"

# Test 6.1: Test directo de Python
cd ../robot
python_response=$(python3 automation_interface.py check_device 2>&1 || echo "ERROR")

if echo "$python_response" | grep -q 'RESULTADO FINAL' && echo "$python_response" | grep -q '"success": true'; then
    log_test "PASS" "Script Python directo"
else
    log_test "FAIL" "Script Python directo" "Respuesta: $python_response"
fi

cd ../backend

echo -e "\n${BLUE}⚡ TEST 7: Cron Jobs y Triggers${NC}"

# Test 7.1: Trigger manual de cron job
response=$(curl -s -X POST "$BASE_URL/automation/trigger-scheduled-check" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if check_http_response "$response" "true"; then
    log_test "PASS" "Trigger manual de cron job"
else
    log_test "FAIL" "Trigger manual de cron job" "Respuesta: $response"
fi

echo -e "\n${BLUE}📈 TEST 8: Verificación de Métricas${NC}"

# Test 8.1: Verificar que se generen métricas después de procesos
sleep 2  # Esperar a que se procesen los logs

response=$(curl -s -X GET "$BASE_URL/automation/stats/daily" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if echo "$response" | grep -q '"totalProcesses":[1-9]'; then
    log_test "PASS" "Métricas se generan correctamente"
else
    log_test "FAIL" "Métricas se generan correctamente" "Sin procesos registrados"
fi

echo -e "\n${BLUE}🔒 TEST 9: Seguridad y Autorización${NC}"

# Test 9.1: Endpoint sin autorización
response=$(curl -s -X GET "$BASE_URL/automation/history" \
    -H "Content-Type: application/json" || echo "ERROR")

if echo "$response" | grep -q '"Unauthorized"' || echo "$response" | grep -q '401'; then
    log_test "PASS" "Protección sin token"
else
    log_test "FAIL" "Protección sin token" "Debería rechazar sin token"
fi

# Test 9.2: Token inválido
response=$(curl -s -X GET "$BASE_URL/automation/history" \
    -H "Authorization: Bearer INVALID_TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if echo "$response" | grep -q '"Unauthorized"' || echo "$response" | grep -q '401'; then
    log_test "PASS" "Protección con token inválido"
else
    log_test "FAIL" "Protección con token inválido" "Debería rechazar token inválido"
fi

echo -e "\n${BLUE}💾 TEST 10: Base de Datos y Persistencia${NC}"

# Test 10.1: Verificar que se guardan logs
response=$(curl -s -X GET "$BASE_URL/automation/history?limit=1" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" || echo "ERROR")

if echo "$response" | grep -q '"id"' && echo "$response" | grep -q '"timestamp"'; then
    log_test "PASS" "Persistencia de logs en DB"
else
    log_test "FAIL" "Persistencia de logs en DB" "No se encontraron logs válidos"
fi

# ================================================
# RESUMEN DE RESULTADOS
# ================================================

echo -e "\n=================================================="
echo -e "${YELLOW}📊 RESUMEN DE RESULTADOS DE TESTING${NC}"
echo "=================================================="
echo -e "Total de tests ejecutados: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Tests aprobados: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Tests fallidos: ${RED}$FAILED_TESTS${NC}"

# Calcular porcentaje de éxito
if [ $TOTAL_TESTS -gt 0 ]; then
    SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    echo -e "Tasa de éxito: ${BLUE}$SUCCESS_RATE%${NC}"
else
    SUCCESS_RATE=0
fi

echo "=================================================="

# Determinar estado final
if [ $SUCCESS_RATE -ge 95 ]; then
    echo -e "${GREEN}🎉 SISTEMA COMPLETAMENTE FUNCIONAL${NC}"
    echo -e "${GREEN}✅ Todos los componentes están operativos${NC}"
    exit 0
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo -e "${YELLOW}⚠️  SISTEMA MAYORMENTE FUNCIONAL${NC}"
    echo -e "${YELLOW}⚠️  Revisar tests fallidos${NC}"
    exit 1
else
    echo -e "${RED}❌ SISTEMA CON PROBLEMAS CRÍTICOS${NC}"
    echo -e "${RED}❌ Revisar configuración y dependencias${NC}"
    exit 2
fi
